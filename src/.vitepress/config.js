import { version } from '../../package.json'

export default {
  title: 'Element3',
  description: 'Vue3 components for learn',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.ico',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'alternate icon',
        href: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
  ],
  // base:"/src/"
  themeConfig: {
    logo: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png',
    nav: [
      { text: '组件', link: '/guide' },
      { text: version, link: 'https://www.npmjs.com/package/element3' },
    ],
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/channels/987387170232868904/987387170794922005',
      },
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
            { text: 'Button 按钮', link: '/components/button/' },
            { text: 'Divider 分割线', link: '/components/divider/' },
            { text: 'Avatar 头像', link: '/components/avatar/' },
            { text: 'Link 链接', link: '/components/link/' },
            { text: 'Icon 图标', link: '/components/icon/' },
            { text: 'Empty 无内容', link: '/components/empty/' },
            { text: 'Tag 标签', link: '/components/tag/' },
          ],
        },
        {
          text: '布局组件',
          items: [
            { text: 'Container 布局', link: '/components/container/' },
            { text: 'Layout 布局', link: '/components/layout/' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Radio 单选框', link: '/components/radio/' },
          ],
        },
        {
          text: '提示组件',
          items: [{ text: 'Alert 警告', link: '/components/alert/' }],
        },
        {
          text: '数据展示组件',
          items: [
            { text: 'Badge 标记', link: '/components/badge/' },
            { text: 'Card 卡片', link: '/components/card/' },
            { text: 'Progress 进度条', link: '/components/progress/' },
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
