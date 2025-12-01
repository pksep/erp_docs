import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/erp_docs/",
  title: "ERP Поддержка",
  description: "Центр помощи ERP",
  head: [
    ["link", { rel: "icon", href: "/erp_docs/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
  ],
  locales: {
    root: { label: "Русский" },
  },
  themeConfig: {
    nav: [
      { text: "Документы", link: "/" },
      {
        text: "Вернутся в ERP",
        link: "https://dev.pksep.ru",
      },
    ],
    sidebar: [
      {
        text: "Основы",
        items: [{ text: "Введение", link: "/" }],
      },
    ],
    socialLinks: [],
  },
});
