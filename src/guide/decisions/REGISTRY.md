# Реестр решений

В этом файле перечислены решения и технические документы, принятые в проекте.

## Принятые решения

| ID | Title | Status | Date |
|----|-------|--------|------|| [0001](/guide/decisions/0001-initialize-documentation) | Инициализация документации ADR | Accepted | 2025-09-09 |
| [0002](/guide/decisions/0002-file-handling-architecture) | Архитектура работы с файлами | Proposed | 2025-09-09 |
| [0003](/guide/decisions/0003-comment-handling-architecture) | Архитектура работы с комментариями | Accepted | 2025-10-02 |
| [0004](/guide/decisions/0004-production-task-handling-architecture) | Архитектура работы с производственными задачами | Accepted | 2026-01-26 |
| [0005](/guide/decisions/0005-production-task-start-time-handling-architecture) | Фактическое время начала операций (`start_time`) | Accepted | 2026-03-06 |
| [0006](/guide/decisions/0006-users-by-production-task) | Загруженность сотрудников по производственным задачам | Accepted | 2026-01-30 |
| [0007](/guide/decisions/0007-production-task-plan-ready-time) | Плановая дата готовности (`plan_ready_time`) и расчетное начало (`calculate_start_time`) | Accepted | 2026-02-04 |
| [0008](/guide/decisions/008-calculate-needs-time) | Расчетная дата изготовления (`calculate_needs_time`) | Accepted | 2026-02-18 |
| [0010](/guide/decisions/010-production-task-filters) | Фильтры производственных задач | Accepted | 2026-02-20 |
| [0011](/guide/decisions/011-create-production-task) | Создание производственной задачи | Accepted | 2026-02-24 |
| 0012 | Расчет `start_time` для первой сборочной операции | Accepted | 2026-02-24 |
| [0013](/guide/decisions/013-change-equipment-and-responsible-user) | Смена оборудования и ответственного пользователя | Accepted | 2026-03-03 |
| [0014](/guide/decisions/014-archive-production-task) | Архивирование производственной задачи | Accepted | 2026-03-04 |
| [0015](/guide/decisions/015-user-table-config) | Конфигурация таблиц пользователей | Accepted | 2026-03-16 |
| [0016](/guide/decisions/016-sequelize-hooks) | Sequelize Hooks: слушатели событий базы данных | Accepted | 2026-03-20 |
| [0017](/guide/decisions/017-warehouse-readiness-date) | Дата готовности на складе (`warehouse_readiness_date`) | Accepted | 2026-05-13 |
| [auth](/guide/decisions/auth) | Аутентификация | Accepted | - |
| [logger](/guide/decisions/logger) | Логгер | Accepted | - |
## Statuses

- **Proposed** - решение предложено, но еще не принято
- **Accepted** - решение принято и реализовано
- **Deprecated** - решение больше не актуально
- **Superseded** - решение заменено другим решением
