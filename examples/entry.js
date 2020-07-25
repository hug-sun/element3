import {createApp,reactive,nextTick} from 'vue';
import entry from './app';
console.log(entry)

import { createRouter,createWebHistory,createWebHashHistory} from 'vue-router';
import Element from 'main/index.js';
import hljs from 'highlight.js';
import routes from './route.config';
import demoBlock from './components/demo-block';
import MainFooter from './components/footer';
import MainHeader from './components/header';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
import title from './i18n/title';

import 'packages/theme-chalk/src/index.scss';
import './demo-styles/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';
import icon from './icon.json';

const app = createApp({ // eslint-disable-line
  ...entry
})
app.use(Element);
// app.use(VueRouter);
app.component('demo-block', demoBlock);
app.component('main-footer', MainFooter);
app.component('main-header', MainHeader);
app.component('side-nav', SideNav);
app.component('footer-nav', FooterNav);

const globalEle = reactive({
  data: { $isEle: false } // 是否 ele 用户
});

app.mixin({
  computed: {
    $isEle: {
      get: () => (globalEle.data.$isEle),
      set: (data) => {globalEle.data.$isEle = data;}
    }
  }
});
app.config.globalProperties.$icon = icon

const router = createRouter({
  hash: createWebHashHistory(__dirname),
  // history: createWebHistory(__dirname),
  routes
})
app.use(router)

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
  
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Element';
  ga('send', 'event', 'PageView', route.name);
});
new Vue({ // eslint-disable-line
  ...entry,
  router
}).$mount('#app');
