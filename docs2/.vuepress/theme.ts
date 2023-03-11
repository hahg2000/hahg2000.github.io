import { hopeTheme } from 'vuepress-theme-hope'
import navbar from './navbar'
import sidebar from './sidebar'

export default hopeTheme({
  hostname: 'https://vuepress-theme-hope-v2-demo.mrhope.site',

  author: {
    name: 'hahg',
    url: 'https://mrhope.site',
  },

  iconAssets: '//at.alicdn.com/t/font_2410206_a0xb9hku9iu.css',

  logo: '/logo.svg',

  repo: 'vuepress-theme-hope/vuepress-theme-hope',

  docsDir: 'demo/src',

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  footer: '默认页脚',

  displayFooter: true,

  pageInfo: ['Author', 'Original', 'Date', 'Category', 'Tag', 'ReadingTime'],

  blog: {
    name: 'HAHG',
    description: '学渣，二次元，前端学习者',
    intro: '/intro.html',
    medias: {
      GitHub: 'https://example.com',
    },
  },

  fullscreen: false,

  themeColor: false,

  encrypt: {
    config: {
      '/guide/encrypt.html': ['1234'],
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    // 如果你不需要评论，可以直接删除 comment 配置，
    // 以下配置仅供体验，如果你需要评论，请自行配置并使用自己的环境，详见文档。
    // 为了避免打扰主题开发者以及消耗他的资源，请不要在你的正式环境中直接使用下列配置!!!!!
    // comment: {
    //   /**
    //    * Using giscus
    //    */
    //   type: 'giscus',
    //   repo: 'vuepress-theme-hope/giscus-discussions',
    //   repoId: 'R_kgDOG_Pt2A',
    //   category: 'Announcements',
    //   categoryId: 'DIC_kwDOG_Pt2M4COD69',

    //   /**
    //    * Using twikoo
    //    */
    //   // type: "twikoo",
    //   // envId: "https://twikoo.ccknbc.vercel.app",

    //   /**
    //    * Using Waline
    //    */
    //   // type: "waline",
    //   // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    mdEnhance: {
      // 启用代码演示
      demo: true,
      mark: true,
      // 启用数学公式
      tex: true,
      // 启用下角标功能
      sub: true,
      // 启用上角标
      sup: true,
      // 启用echarts
      echarts: true,

      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
    },
  },
})
