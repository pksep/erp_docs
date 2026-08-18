import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/erp_docs/",
  title: "Документация ERP",
  description: "Полное руководство пользователя ERP системы",
  lastUpdated: true,
  ignoreDeadLinks: false,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
  ],
  locales: {
    root: {
      label: "Русский",
      lang: "ru",
    },
  },
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "ERP Документация",
    nav: [
      { text: "Главная", link: "/" },
      { text: "Руководство", link: "/guide/getting-started" },
      { text: "Видео-гайды", link: "/videos/" },
      {
        text: "Вернуться в ERP",
        link: "https://dev.pksep.ru",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Начало работы",
          items: [
            { text: "Начало работы", link: "/guide/getting-started" },
            { text: "Справочник по терминам", link: "/guide/glossary" },
          ],
        },
        {
          text: "Решения",
          items: [
            { text: "Реестр решений", link: "/guide/decisions/REGISTRY" },
            { text: "Инициализация документации", link: "/guide/decisions/0001-initialize-documentation" },
            { text: "Работа с файлами", link: "/guide/decisions/0002-file-handling-architecture" },
            { text: "Работа с комментариями", link: "/guide/decisions/0003-comment-handling-architecture" },
            { text: "Производственные задачи", link: "/guide/decisions/0004-production-task-handling-architecture" },
            { text: "Фактическое начало операций", link: "/guide/decisions/0005-production-task-start-time-handling-architecture" },
            { text: "Загруженность сотрудников", link: "/guide/decisions/0006-users-by-production-task" },
            { text: "Плановая дата готовности", link: "/guide/decisions/0007-production-task-plan-ready-time" },
            { text: "Расчетная дата изготовления", link: "/guide/decisions/008-calculate-needs-time" },
            { text: "Фильтры ПЗ", link: "/guide/decisions/010-production-task-filters" },
            { text: "Создание ПЗ", link: "/guide/decisions/011-create-production-task" },
            { text: "Смена оборудования/пользователя", link: "/guide/decisions/013-change-equipment-and-responsible-user" },
            { text: "Архивирование ПЗ", link: "/guide/decisions/014-archive-production-task" },
            { text: "Конфигурация таблиц", link: "/guide/decisions/015-user-table-config" },
            { text: "Sequelize Hooks", link: "/guide/decisions/016-sequelize-hooks" },
            { text: "Готовность на складе", link: "/guide/decisions/017-warehouse-readiness-date" },
            { text: "Аутентификация", link: "/guide/decisions/auth" },
            { text: "Логгер", link: "/guide/decisions/logger" },
          ],
        },
        {
          text: "Обратное планирование",
          items: [
            { text: "Обратное планирование", link: "/guide/backward-planning" },
            { text: "Требуемое время готовности детали", link: "/guide/backward-planning/required-readiness-date-detal" },
            { text: "Требуемое время готовности сборки", link: "/guide/backward-planning/required-readiness-date-cbed" },
          ],
        },
        {
          text: "Формулы и расчеты",
          items: [
            { text: "Понятия и формулы", link: "/guide/formulas/0001-formulas" },
          ],
        },
      ],

      "/videos/": [
        {
          text: "Видео-гайды",
          items: [
            { text: "Видео-гайды", link: "/videos/" },
          ],
        },
      ],
      "/": [
        {
          text: "Основы",
          items: [
            { text: "Введение", link: "/" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/pksep/erp_docs" },
    ],
    editLink: {
      pattern: "https://github.com/pksep/erp_docs/edit/main/src/:path",
      text: "Редактировать страницу",
    },
    footer: {
      message: "Опубликовано под лицензией MIT.",
      copyright: "© 2025 Ваша компания",
    },
    docFooter: {
      prev: "Назад",
      next: "Далее",
    },
  },
});
