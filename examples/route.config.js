import { defineAsyncComponent } from 'vue'
import navConfig from './nav.config'
import langs from './i18n/route'

const LOAD_MAP = {
  'zh-CN': (name) => {
    return defineAsyncComponent(() => import(`./pages/zh-CN/${name}.vue`))
  },
  'en-US': (name) => {
    return defineAsyncComponent(() => import(`./pages/en-US/${name}.vue`))
  },
  es: (name) => {
    return defineAsyncComponent(() => import(`./pages/es/${name}.vue`))
  },
  'fr-FR': (name) => {
    return defineAsyncComponent(() => import(`./pages/fr-FR/${name}.vue`))
  }
}

const load = function (lang, path) {
  return LOAD_MAP[lang](path)
}

const LOAD_DOCS_MAP = {
  'zh-CN': (path) => {
    return defineAsyncComponent(() => import(`./docs/zh-CN${path}.md`))
  },
  'en-US': (path) => {
    return defineAsyncComponent(() => import(`./docs/en-US${path}.md`))
  },
  es: (path) => {
    return defineAsyncComponent(() => import(`./docs/es${path}.md`))
  },
  'fr-FR': (path) => {
    return defineAsyncComponent(() => import(`./docs/fr-FR${path}.md`))
  }
}

const loadDocs = function (lang, path) {
  return LOAD_DOCS_MAP[lang](path)
}

const registerRoute = (navConfig) => {
  const route = []
  Object.keys(navConfig).forEach((lang, index) => {
    const navs = navConfig[lang]
    route.push({
      path: `/${lang}/component`,
      redirect: `/${lang}/component/installation`,
      component: load(lang, 'component'),
      children: []
    })
    navs.forEach((nav) => {
      if (nav.href) return
      if (nav.groups) {
        nav.groups.forEach((group) => {
          group.list.forEach((nav) => {
            addRoute(nav, lang, index)
          })
        })
      } else if (nav.children) {
        nav.children.forEach((nav) => {
          addRoute(nav, lang, index)
        })
      } else {
        addRoute(nav, lang, index)
      }
    })
  })
  function addRoute(page, lang, index) {
    const component =
      page.path === '/changelog'
        ? load(lang, 'changelog')
        : loadDocs(lang, page.path)
    const child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
        lang
      },
      name: 'component-' + lang + (page.title || page.name),
      component: component.default || component
    }

    route[index].children.push(child)
  }

  return route
}

let route = registerRoute(navConfig)

const generateMiscRoutes = function (lang) {
  const guideRoute = {
    path: `/${lang}/guide`, // 指南
    redirect: `/${lang}/guide/design`,
    component: load(lang, 'guide'),
    children: [
      {
        path: 'design', // 设计原则
        name: 'guide-design' + lang,
        meta: { lang },
        component: load(lang, 'design')
      },
      {
        path: 'nav', // 导航
        name: 'guide-nav' + lang,
        meta: { lang },
        component: load(lang, 'nav')
      }
    ]
  }

  const themeRoute = {
    path: `/${lang}/theme`,
    component: load(lang, 'theme-nav'),
    children: [
      {
        path: '/', // 主题管理
        name: 'theme' + lang,
        meta: { lang },
        component: load(lang, 'theme')
      },
      {
        path: 'preview', // 主题预览编辑
        name: 'theme-preview-' + lang,
        meta: { lang },
        component: load(lang, 'theme-preview')
      }
    ]
  }

  const resourceRoute = {
    path: `/${lang}/resource`, // 资源
    meta: { lang },
    name: 'resource' + lang,
    component: load(lang, 'resource')
  }

  const indexRoute = {
    path: `/${lang}`, // 首页
    meta: { lang },
    name: 'home' + lang,
    component: load(lang, 'index')
  }

  return [guideRoute, resourceRoute, themeRoute, indexRoute]
}

langs.forEach((lang) => {
  route = route.concat(generateMiscRoutes(lang.lang))
})

route.push({
  path: '/play',
  name: 'play',
  component: require('./play/index.vue')
})
//To-do:目前只支持中文环境，所以设置中文为默认值
let defaultPath = '/zh-CN'
// const userLanguage =
//   localStorage.getItem('ELEMENT_LANGUAGE') ||
//   window.navigator.language ||
//   'zh-CN'
// let defaultPath = '/zh-CN'
// if (userLanguage.indexOf('zh-') !== -1) {
//   defaultPath = '/zh-CN'
// } else if (userLanguage.indexOf('es') !== -1) {
//   defaultPath = '/es'
// } else if (userLanguage.indexOf('fr') !== -1) {
//   defaultPath = '/fr-FR'
// }

route = route.concat([
  {
    path: '/',
    redirect: { path: defaultPath }
  },
  {
    path: '',
    redirect: { path: defaultPath }
  }
])
console.log(route)
export default route
