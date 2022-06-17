export default {
  title: 'Element3',
  description: 'Vue3 components for learn',
  // base:"/src/"
  themeConfig:{
    logo: 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png',
    nav: [
      { text: '组件', link: '/guide' },
    ],
    sidebar:{
      "/":[
        {text:'通用组件',items:[
          {text:'Button',link:'/components/button/'},
          {text:'Divider',link:'/components/divider/'},
          // {text:'Avatar',link:'/components/avatar/'},
          {text:'Link',link:'/components/link/'},
        ]}
      ]
    }
  },
  markdown: {
    config: (md) => {
      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin)
    }
  }
}