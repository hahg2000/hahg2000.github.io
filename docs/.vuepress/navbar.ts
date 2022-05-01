import { defineNavbarConfig } from 'vuepress-theme-hope'

export default defineNavbarConfig([
  // "/",
  // "/home",
  { text: '学习笔记', icon: 'creative', link: '/学习笔记/前端/' },
  {
    text: '生活笔记',
    icon: 'edit',
    link: '/生活笔记/',
  },
  {
    text: '关于我',
    icon: 'light',
    link: 'https://vuepress-theme-hope.github.io/v2/zh/',
  },
  {
    text: '常用链接',
    icon: 'network',
    link: 'https://vuepress-theme-hope.github.io/v2/zh/',
  },
])
