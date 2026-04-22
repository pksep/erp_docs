# Расчёт start_time для первой сборочной операции (idx=1)

## Назначение

Метод `setActualStartTimeByChildren` гарантирует, что сборка начнётся **только после готовности всех входящих компонентов** (дочерних сборок и деталей 1-го уровня).

## Алгоритм

```
entityId (cbed/product)
    │
    ▼
Потомки 1-го уровня (Neo4j)
    │  деталь и: [detalIds]
    │  сборки: [cbedsIds]
    ▼
MAX(calculate_needs_time) среди всех потомков
    │
    ▼
Найти операции с idx=1 для entityId
    │
    ▼
Установить start_time = maxCalculateNeedsTime
```

## Реализация

1. **Получение потомков:** `neo4jSpetificationService.getFirstLevelChildrensByRelativeParsed()` →развёртка спецификации на один уровень.
2. **Расчёт maxCalculateNeedsTime:** `MAX(calculate_needs_time)` для всех ID потомков — момент готовности последнегокомпонента.
3. **Поиск операций:** `operationPositionRepository.findAll()` с фильтрами:
   - `production_operation_pos_id` ∈ найденные позиции
   - `ban = false`
   - `$operation.idx$ = 1`
4. **Применение:** `start_time = maxCalculateNeedsTime` для каждой найденной операции.

## Связь с другими процессами

- Изменение `start_time` первой операции (`idx=1`) инициирует пересчёт всех последующих операций (`idx > 1`) в техпроцессе.
- Источник: `calculate_needs_time` обновляется при расчёте `plan_ready_time` (см. ADR-0007).
