import { createApp, reactive } from 'vue'
import EntryApp from './app'

import { createRouter, createWebHashHistory } from 'vue-router'
// import * as Element3 from '../dist/element3-ui.esm-bundler'
import * as Element3 from 'main/entry.js'
import routes from './route.config'
import demoBlock from './components/demo-block'
import MainHeader from './components/header'
import SideNav from './components/side-nav'
import FooterNav from './components/footer-nav'
import title from './i18n/title'

import 'packages/theme-chalk/src/index.scss'
import './demo-styles/index.scss'
import './assets/styles/common.css'
import './assets/styles/fonts/style.css'
import icon from './icon.json'

const app = createApp(EntryApp)
app.use(Element3)
// app.use(VueRouter);
app.component('demo-block', demoBlock)
// app.component('main-footer', MainFooter);
app.component('main-header', MainHeader)
app.component('side-nav', SideNav)
app.component('footer-nav', FooterNav)

const globalEle = reactive({
  data: { $isEle: false } // 是否 ele 用户
})

// 方便在 demo 里面全局导入 element3
window.Element3 = Element3

app.mixin({
  computed: {
    $isEle: {
      get: () => globalEle.data.$isEle,
      set: (data) => {
        globalEle.data.$isEle = data
      }
    }
  }
})
app.config.globalProperties.$icon = icon

const router = createRouter({
  history: createWebHashHistory(__dirname),
  // history: createWebHistory(__dirname),
  routes
})
app.use(router)

router.isReady().then(() => {
  router.afterEach(async (route) => {
    // await nextTick()
    // const blocks = document.querySelectorAll('pre code:not(.hljs)')
    // Array.prototype.forEach.call(blocks, hljs.highlightBlock)

    // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186

    // setTimeout(()=>{
    //   const blocks = document.querySelectorAll('pre code:not(.hljs)');
    //   Array.prototype.forEach.call(blocks, hljs.highlightBlock);
    // },1000)

    const data = title[route.meta.lang]
    for (const val in data) {
      if (new RegExp('^' + val, 'g').test(route.name)) {
        document.title = data[val]
        return
      }
    }
    document.title = 'Element'
    // eslint-disable-next-line no-undef
    ga('send', 'event', 'PageView', route.name)
  })
  app.mount('#app')
})

export default app
