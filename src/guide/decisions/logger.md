# Логгер

Модуль логирования построен на базе [nestjs-pino](https://github.com/iamolegga/nestjs-pino) и библиотеки [Pino](https://github.com/pinojs/pino). Обеспечивает структурированное JSON-логирование, привязку `requestId` к каждому HTTP-запросу и глобальный перехват ошибок.

## Архитектура

```
LoggerModule (Global)
├── LoggerService          — обёртка над PinoLogger (реализует NestLoggerService)
├── AllExceptionsFilter    — глобальный перехватчик ошибок
└── logger.config.ts       — конфигурация Pino
```

### LoggerModule

**Файл:** `src/modules/logger/logger.module.ts`
Глобальный модуль (`@Global()`), импортирует `nestjs-pino` через `PinoLoggerModule.forRootAsync()` и экспортирует `LoggerService` для инъекции в любой сервис.

### LoggerService

**Файл:** `src/modules/logger/logger.service.ts`
Реализует интерфейс `NestLoggerService` и делегирует вызовы в `PinoLogger`:

| Метод | Pino-уровень | Описание |
|---|---|---|
| `log(message, context?)` | `info` | Информационные сообщения |
| `error(error, context?)` | `error` | Ошибки; `Error`-объекты логируются со стеком |
| `warn(message, context?)` | `warn` | Предупреждения |
| `debug(message, context?)` | `debug` | Отладочная информация |
| `verbose(message, context?)` | `trace` | Подробные (trace) логи |

**Обработка ошибок в `error()`:**
- `Error` → `{ err: error, context }` + `error.message` (Pino сериализует стек)
- `string` → `{ error, context }` + строка
- Остальное → `{ error, context }` + `JSON.stringify(error)`

### AllExceptionsFilter

**Файл:** `src/modules/logger/filters/all-exceptions.filter.ts`
Глобальный `@Catch()` фильтр. Перехватывает все необработанные исключения:

1. Определяет HTTP-статус через `resolveStatus()` (валидирует диапазон 100–599)
2. Извлекает сообщение: `HttpException.getResponse()` → `Error.message` → `'Internal server error'`
3. Нормализует: объект → `message.message`; массив → `join(', ')`
4. Логирует через `LoggerService.error()` с контекстом `HTTP {method} {url} reqId={id}`
5. Возвращает JSON: `{ statusCode, message, reqId }`

## Конфигурация Pino
**Файл:** `src/utils/logger/logger.config.ts`

| Параметр | Значение |
|---|---|
| **Уровень** | `PINO_LOG_LEVEL` или `'warn'` по умолчанию |
| **Транспорт** | `pino-pretty` (dev) / JSON (production) |
| **Request ID** | `x-request-id` заголовок или `randomUUID()` |
| **Игнорируемые эндпоинты** | `/health`, `/metrics`, `/favicon.ico` |

### Сериализаторы
- **req:** `{ id, method, url }` — минимальная информация о запросе
- **res:** `{ statusCode }` — только код ответа
- **err:** `{ type, message, stack }` — полная информация об ошибке

### Redact (удаление чувствительных данных)
Автоматически удаляются из логов:
- `req.headers.authorization`, `req.headers.cookie`
- `body.password`, `body.token`, `body.accessToken`, `body.refreshToken`

## Переменные окружения

| Переменная | Описание | По умолчанию |
|---|---|---|
| `PINO_LOG_LEVEL` | Уровень логирования (`fatal`, `error`, `warn`, `info`, `debug`, `trace`) | `warn` |
| `NODE_ENV` | Определяет транспорт: `production` → JSON, иначе → `pino-pretty` | — |

## Использование

```typescript
@Injectable()
export class MyService {
  constructor(private logger: LoggerService) {}

  async doWork() {
    this.logger.log('Операция выполнена', MyService.name);
    this.logger.error(new Error('Ошибка'), MyService.name);
    this.logger.warn('Предупреждение', MyService.name);
  }
}
```

## Тесты
Юнит-тесты расположены в `src/modules/logger/tests/logger.spec.ts`. Покрывают:
- `AllExceptionsFilter`: HttpException, Error, неизвестные исключения, `resolveStatus()`
- `LoggerService`: все уровни логирования, обработку Error/string/object в `error()`

Запуск:
```bash
bun run test:unit -- --testPathPattern=logger
```

