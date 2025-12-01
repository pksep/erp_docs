import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ERP Docs',
  description: 'Documentation for our ERP system',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ]
  }
})