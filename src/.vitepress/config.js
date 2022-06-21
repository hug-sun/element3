import { version } from '../../package.json'

export const discord = 'https://chat.vitest.dev'
export const twitter = 'https://twitter.com/vitest_dev'

export default {
  title: 'Element3',
  description: 'Vue3 components for learn',
  head: [
    ['link', { rel: 'icon', href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.ico', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png', type: 'image/png', sizes: '16x16' }],
  ],
  // base:"/src/"
  themeConfig: {
    logo: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png',
    nav: [
      { text: '组件', link: '/guide' },
      { text: version, link: 'https://www.npmjs.com/package/element3' },
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.com/channels/987387170232868904/987387170794922005' },
      { icon: 'github', link: 'https://github.com/hug-sun/element3' },
    ],
    sidebar: {

      '/': [
        {
          text: '教程',
          items: [
            { text: '组件开发步骤', link: '/components/' },
            { text: '开发规范', link: '/guide/scripts' },
          ],
        },
        {
          text: '通用组件',
          items: [
            { text: 'Button', link: '/components/button/' },
            { text: 'Divider', link: '/components/divider/' },
            { text: 'Avatar', link: '/components/avatar/' },
            { text: 'Link', link: '/components/link/' },
            { text: 'Icon', link: '/components/icon/' },
            { text: 'Tag', link: '/components/tag/' },
          ],
        },
        {
          text: '表单组件',
          items: [],
        },
        {
          text: '提示组件',
          items: [],
        },
        {
          text: '数据展示组件',
          items: [
            { text: 'Badge', link: '/components/badge/' },
          ],
        },
        {
          text: '其他组件',
          items: [],
        },
      ],
    },
  },
  markdown: {
    config: (md) => {
      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin)
    },
  },
}
