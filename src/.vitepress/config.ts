import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/erp_docs/",
  title: "Документация ERP",
  description: "Полное руководство пользователя ERP системы",
  lastUpdated: true,
  ignoreDeadLinks: "localhost",
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
          text: "Getting Started",
          items: [
            { text: "Начало работы", link: "/guide/getting-started" },
            { text: "Справочник по терминам", link: "/guide/glossary" },
          ],
        },
        {
          text: "Архитектурные решения",
          items: [
            { text: "Реестр решений", link: "/guide/decisions/REGISTRY" },
            { text: "ADR-0001 Инициализация документации", link: "/guide/decisions/0001-initialize-documentation" },
            { text: "ADR-0002 Работа с файлами", link: "/guide/decisions/0002-file-handling-architecture" },
            { text: "ADR-0003 Работа с комментариями", link: "/guide/decisions/0003-comment-handling-architecture" },
            { text: "ADR-0004 Производственные задания", link: "/guide/decisions/0004-production-task-handling-architecture" },
            { text: "ADR-0005 Расчёт start_time", link: "/guide/decisions/0005-production-task-start-time-handling-architecture" },
            { text: "ADR-0006 Загруженность сотрудников", link: "/guide/decisions/0006-users-by-production-task" },
            { text: "ADR-0007 plan_ready_time", link: "/guide/decisions/0007-production-task-plan-ready-time" },
            { text: "Расчётная дата изготовления", link: "/guide/decisions/008-calculate-needs-time" },
            { text: "Комплектация сборок", link: "/guide/decisions/009-calculate-complect-time" },
            { text: "Фильтры ПЗ", link: "/guide/decisions/010-production-task-filters" },
            { text: "Создание ПЗ", link: "/guide/decisions/011-create-production-task" },
            { text: "start_time idx=1", link: "/guide/decisions/012-start-time-ass-idx-1" },
            { text: "Смена оборудования/пользователя", link: "/guide/decisions/013-change-equipment-and-responsible-user" },
            { text: "Архивирование ПЗ", link: "/guide/decisions/014-archive-production-task" },
            { text: "Конфигурация таблиц", link: "/guide/decisions/015-user-table-config" },
            { text: "Аутентификация", link: "/guide/decisions/auth" },
            { text: "Логгер", link: "/guide/decisions/logger" },
          ],
        },
        {
          text: "Формулы и расчёты",
          items: [
            { text: "Понятия и формулы", link: "/guide/formulas/0001-formulas" },
          ],
        },
      ],

      "/videos/": [
        {
          text: "Видео-гайды",
          items: [
            { text: "Начало работы", link: "/videos/#начало-работы" },
            { text: "Управление складом", link: "/videos/#управление-складом" },
            { text: "Работа с заказами", link: "/videos/#работа-с-заказами" },
            { text: "Отчетность", link: "/videos/#отчетность-и-аналитика" },
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
      { icon: 'github', link: 'https://github.com/pksep/erp_docs' },
    ],
    editLink: {
      pattern: 'https://github.com/pksep/erp_docs/edit/main/src/:path',
      text: 'Редактировать страницу',
    },
    footer: {
      message: 'Опубликовано под лицензией MIT.',
      copyright: '© 2025 Ваша компания',
    },
    docFooter: {
      prev: 'Назад',
      next: 'Далее',
    },
  },
});
