# Sequelize Hooks (Слушатели событий базы данных)

## Цели и задачи
Модуль `sequelize-hook` предназначен для перехвата событий изменения данных (создание, обновление, удаление, изменение связей) в базе данных и отправки соответствующих уведомлений в брокер сообщений (RabbitMQ). 

Основные цели:
- **Отслеживание изменений**: Автоматически регистрировать изменения полей, создание новых записей и связей для заданных сущностей.
- **Оптимизация отправки (Batching)**: Накапливать изменения в процессе выполнения запросов и отправлять их единым пакетом, чтобы избежать спама сообщениями.
- **Поддержка транзакций и одиночных запросов**: Гарантировать, что события будут отправлены только после успешного завершения транзакции (hook `afterCommit`), либо сразу после выполнения одиночного запроса (если транзакция не используется).

---

## Архитектура и разбор кода

Система базируется на стандартных хуках Sequelize. Логика разделена на два файла: сами хуки (`sequelize-hooks.ts`) и вспомогательные функции по накоплению событий (`sequelize-hook.helpers.ts`).

### 1. Вспомогательные функции (`sequelize-hook.helpers.ts`)

Хелперы отвечают за создание временного хранилища "событий" (бакета) для текущей операции. Хранилище привязывается к объекту транзакции (`options.transaction`) или к самому объекту опций запроса (`options`), если транзакции нет.

#### Накопление данных (`getEntityBucket` и функции записи)

Функция `getEntityBucket` инициализирует хранилище для конкретной сущности (по ее ID). В рамках этой функции мы олучаем или создаём bucket (контейнер событий) сущности и привязываем его к `tx` (это либо транзакция, либо options запроса)

```typescript
export const getEntityBucket = (tx: any, entity: string, id: number) => {
  // Инициализируем хранилище, если его еще нет
  tx.__events ??= {};
  tx.__events[entity] ??= {};
  tx.__events[entity][id] ??= {
    created: {},
    changes: [],
    banned: undefined,
    relations: {}
  };

  return tx.__events[entity][id];
};
```

```typescript
export const pushChanges = (
  tx: any,
  entity: string,
  id: number,
  changes: any[]
) => {
  const bucket = getEntityBucket(tx, entity, id);
  // Накапливаем изменения полей в массив changes
  bucket.changes.push(...changes);
};

// Аналогично работают pushCreated, pushBanned, pushRelation
```

**Логика исполнения:** 
Всякий раз, когда вызывается `pushChanges`, `pushCreated` или `pushRelation`, мы обращаемся к бакету. Если запрос выполняется вне транзакции, `tx` будет являться объектом `options` одиночного запроса Sequelize. Данные собираются во временное свойство `__events`.

#### Отправка событий (`registerUnifiedFlush` и `flushEvents`)

Функция `registerUnifiedFlush` решает, когда именно отправлять события. 

```typescript
export const registerUnifiedFlush = async (options: any, rabbitmqService: any) => {
  const tx = options.transaction || options;

  // Флаг защиты от повторной регистрации, если за одну операцию изменено несколько записей
   if (tx.__flushRegistered) return;
  tx.__flushRegistered = true;

  if (options.transaction) {
    // 1. ЕСЛИ ЕСТЬ ТРАНЗАКЦИЯ:
    // Ждем ее успешного завершения (commit). Если транзакция откатится, 
    // коллбек не вызовется, события не отправятся.
    options.transaction.afterCommit(async () => {
      await flushEvents(options.transaction.__events, getUserId(options), rabbitmqService);
    });
  } else {
    // 2. ЕСЛИ ТРАНЗАКЦИИ НЕТ:
    // Мы уже в хуке Sequelize (например, afterUpdate), то есть изменения 
    // в БД уже зафиксированы. Сразу отправляем события асинхронно.
    await flushEvents(options.__events, getUserId(options), rabbitmqService);
  }
};
```

Функция `flushEvents` непосредственно генерирует payload и отправляет его в RabbitMQ.. 
```typescript
const flushEvents = async (events: any, userId: number | null, rabbitmqService: any) => {
  if (!events) return;

  for (const entity of Object.keys(events)) {
    for (const id of Object.keys(events[entity])) {
      const bucket = events[entity][id];

      // Если в бакете нет ничего значимого, пропускаем
      const hasChanges =
        bucket.created || bucket.changes.length > 0 || Object.keys(bucket.relations).length > 0;
      if (!hasChanges) continue;

      // Формируем ключ маршрутизации (Routing Key)
      let routingKey = `${entity}.change`;
      if (bucket.banned !== undefined) routingKey = `${entity}.ban`;
      else if (bucket.created && Object.keys(bucket.created).length > 0) routingKey = `${entity}.create`;

      // Формируем тело сообщения и отправляем в RabbitMQ
      await rabbitmqService.emitEvent(routingKey, userId, {
        id: Number(id),
        ...(bucket.created && { /* данные создания */ }),
        ...(bucket.changes.length > 0 && { changedFields: bucket.changes }),
        ...(bucket.banned !== undefined && { banned: bucket.banned }),
        /* ... отношения ... */
      });
    }
  }
};
```

---

### 2. Хуки Sequelize (`sequelize-hooks.ts`)

Здесь происходит привязка наших хелперов к жизненному циклу Sequelize. Хуки проверяют, подлежит ли модель логированию (по конфигу), анализируют изменения и вызывают `push*` функции.

#### Хуки создания и обновления (`afterCreate`, `afterUpdate`)

```typescript
export function registerSequelizeHooks(sequelize, rabbitmqService) {
  
  // Хук создания новой записи
  sequelize.addHook('afterCreate', async (instance, options: any) => {
    const modelName = instance.constructor.name.toLowerCase();
    if (!HOOK_MODELS.includes(modelName)) return; // Проверка по конфигу

    const tx = options.transaction || options;
    
    // Добавляем флаг, что эту сущность мы уже обработали как "созданную"
    tx.__createdIds ??= new Set<number>();
    tx.__createdIds.add(instance.id);

    const payload = buildPayload();

    // Кладем данные в бакет
    pushCreated(tx, modelName, instance.id, payload);

    // Регистрируем отправку (отработает либо после коммита, либо сразу)
    await registerUnifiedFlush(options, rabbitmqService);
  });

  // Хук обновления записи
  sequelize.addHook('afterUpdate', async (instance, options: any) => {
    const modelName = instance.constructor.name.toLowerCase();
    if (!HOOK_MODELS.includes(modelName)) return;

    const tx = options.transaction || options;

    // Если сущность была создана в этой же транзакции/операции, не отправляем событие "update"
    if (tx.__createdIds?.has(instance.id)) return;

    // Получаем массив названий измененных полей
    const allChanged = instance.changed() || [];
    
    // Фильтруем поля на основе конфигурации FIELD_CONFIG
    const changedFields = filterFields(allChanged, FIELD_CONFIG[modelName]);

    if (changedFields.length === 0) return;

    // Особый случай - блокировка/разблокировка (поле ban)
    const isBanned = changedFields.includes('ban');

    if (isBanned) {
      pushBanned(tx, modelName, instance.id, instance.ban);
      await registerUnifiedFlush(options, rabbitmqService);
    } else {
      // Собираем старые и новые значения по каждому полю
      const changesToEmit = changedFields.map(field => ({
        fieldName: field,
        lastValue: instance.previous(field),
        currentValue: instance.get(field)
      }));

      pushChanges(tx, modelName, instance.id, changesToEmit);
      await registerUnifiedFlush(options, rabbitmqService);
    }
  });
}
```

#### Хуки управления связями Many-to-Many (`afterBulkCreate`, `afterBulkDestroy`)

Для связующих таблиц мы не отслеживаем изменение самой таблицы, а генерируем событие для `source` модели о том, что у нее изменились связи с `target` моделью.

```typescript
  // Хук массового создания (добавление связей, например user_roles)
  sequelize.addHook('afterBulkCreate', async (instances, options: any) => {
    const modelName = instances[0].constructor.getTableName();
    const junction = JUNCTION_MODELS[modelName]; // Конфиг связующей таблицы
    if (!junction) return;

    const tx = options.transaction || options;
    const grouped = new Map<number, number[]>();

    // Группируем добавляемые связи по sourceId
    for (const instance of instances) {
      const sourceId = instance[junction.sourceKey];
      const targetId = instance[junction.targetKey];
      
      if (!grouped.has(sourceId)) grouped.set(sourceId, []);
      grouped.get(sourceId)!.push(targetId);
    }

    // Сохраняем в бакет изменения связей с типом 'add'
    for (const [sourceId, targetIds] of grouped.entries()) {
      pushRelation(tx, junction, sourceId, targetIds, 'add');
    }

    await registerUnifiedFlush(options, rabbitmqService);
  });

  // Хук ПЕРЕД массовым удалением связей
  sequelize.addHook('beforeBulkDestroy', async (options: any) => {
    const modelName = options.model.getTableName();
    const junction = JUNCTION_MODELS[modelName];
    if (!junction) return;

    // В хуке afterBulkDestroy у нас уже не будет доступа к удаленным строкам.
    // Поэтому мы должны заранее (до удаления) найти, какие именно связи удаляются
    // и сохранить их в options.__rowsToDelete
    const rows = await options.model.findAll({
      where: options.where,
      transaction: options.transaction
    });
    options.__rowsToDelete = rows;
  });

  // Хук ПОСЛЕ массового удаления связей
  sequelize.addHook('afterBulkDestroy', async (options: any) => {
    const modelName = options.model.getTableName();
    const junction = JUNCTION_MODELS[modelName];
    if (!junction) return;

    const rows = options.__rowsToDelete || [];
    const tx = options.transaction || options;

    // Берем сохраненные в beforeBulkDestroy строки и регистрируем их удаление
    for (const row of rows) {
      pushRelation(tx, junction, row[junction.sourceKey], [row[junction.targetKey]], 'remove');
    }

    await registerUnifiedFlush(options, rabbitmqService);
  });
```

**Логика исполнения для связей:**
1. При добавлении/удалении записей в join-таблицах Sequelize вызывает `bulk`-версии хуков.
2. Мы идентифицируем главную сущность (`sourceKey`) и добавляемые/удаляемые к ней ID дочерних сущностей (`targetKey`).
3. Для `bulkDestroy` мы вынуждены делать `findAll` в хуке `beforeBulkDestroy`, так как при вызове `afterBulkDestroy` база уже удалила записи, и мы не узнаем, чьи именно связи были удалены. Эти найденные записи прокидываются через `options.__rowsToDelete`.
4. В хуке `afterBulkDestroy` мы достаем их и вызываем `pushRelation` с операцией `'remove'`.

**Пример payload при создании сущности (детали) и записей в связующей таблице**

```json
{
  "id": 5873,
  "name": "Тестовая деталь 100",
  "relations": {
    "documents_detal": { "added": [46925, 46924, 46921], "removed": [] }
  },
  "designation": null
}
```