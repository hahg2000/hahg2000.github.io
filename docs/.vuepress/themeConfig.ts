import { defineThemeConfig } from 'vuepress-theme-hope'
import navbar from './navbar'
import sidebar from './sidebar'

export default defineThemeConfig({
  hostname: 'https://vuepress-theme-hope-v2-demo.mrhope.site',

  author: {
    name: 'hahg',
    // url: 'https://mrhope.site',
  },

  iconPrefix: 'iconfont icon-',

  logo: '/logo.svg',

  repo: 'vuepress-theme-hope/vuepress-theme-hope',

  docsDir: 'demo/src',

  // navbar
  navbar: navbar,

  // 侧边栏自动生成
  sidebar: sidebar,

  footer: '默认页脚',

  displayFooter: true,

  pageInfo: ['Author', 'Original', 'Date', 'Category', 'Tag', 'ReadingTime'],

  blog: {
    name: 'HAHG',
    description: '学渣，二次元，前端学习者',
    intro: '/intro.html',
    avatar: '/小司头像.png',
    roundAvatar: true,
    medias: {
      GitHub: 'https://github.com/hahg2000',
      Steam: 'https://example.com',
      Twitter: 'https://example.com',
      Youtube: 'https://example.com',
    },
  },

  encrypt: {
    config: {
      '/guide/encrypt.html': ['1234'],
    },
  },

  // 禁言全屏功能
  fullscreen: false,

  themeColor: false,

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    // search: {
    //   locales: {
    //     '/zh/': {
    //       placeholder: '搜索',
    //     },
    //   },
    // },

    // 如果你不需要评论，可以直接删除 comment 配置，
    // 以下配置仅供体验，如果你需要评论，请自行配置并使用自己的环境，详见文档。
    // 为了避免打扰主题开发者以及消耗他的资源，请不要在你的正式环境中直接使用下列配置!!!!!
    // comment: {
    //   /**
    //    * Using giscus
    //    */
    //   type: "giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",

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
      enableAll: true,
      demo: true,
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
    },
  },
})
