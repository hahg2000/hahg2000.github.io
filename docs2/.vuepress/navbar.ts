import { navbar } from 'vuepress-theme-hope'

export default navbar([
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
    text: '时间轴',
    icon: 'time',
    link: '/timeline/',
  },
  {
    text: '常用链接',
    icon: 'network',
    link: 'https://vuepress-theme-hope.github.io/v2/zh/',
  },
])
