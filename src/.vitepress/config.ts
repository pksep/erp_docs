import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/erp_docs/",
  title: "Документация ERP",
  description: "Полное руководство пользователя ERP системы",
  lastUpdated: true,
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
