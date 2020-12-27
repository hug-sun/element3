import { defineAsyncComponent } from 'vue'
import navConfig from './nav.config'

const load = (path) =>
  defineAsyncComponent(() => import(`../pages/${path}.vue`))

const loadDocs = (path) =>
  defineAsyncComponent(() => import(`../docs${path}.md`))

const registerRoute = (navConfig) => {
  const route = []

  route.push({
    path: `/component`,
    redirect: `/component/installation`,
    component: load('component'),
    children: []
  })

  navConfig.forEach((nav) => {
    if (nav.href) return
    if (nav.groups) {
      nav.groups.forEach((group) => {
        group.list.forEach((nav) => {
          addRoute(nav)
        })
      })
    } else if (nav.children) {
      nav.children.forEach((nav) => {
        addRoute(nav)
      })
    } else {
      addRoute(nav)
    }
  })

  function addRoute(page) {
    const component =
      page.path === '/changelog' ? load('changelog') : loadDocs(page.path)
    const child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description
      },
      name: 'component' + (page.title || page.name),
      component: component.default || component
    }

    route[0].children.push(child)
  }

  return route
}

let route = registerRoute(navConfig)

const generateRoutes = function () {
  const resourceRoute = {
    path: `/resource`, // 资源
    name: 'resource',
    component: load('resource')
  }

  const indexRoute = {
    path: `/`, // 首页
    name: 'home',
    component: load('index')
  }

  return [resourceRoute, indexRoute]
}

route = route.concat(generateRoutes())

export default route
