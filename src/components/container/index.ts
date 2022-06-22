import ElContainer from './Container.vue'
import ElHeader from './components/header'
import ElAside from './components/aside'
import ElMain from './components/main'
import ElFooter from './components/footer'

ElContainer.install = function (app) {
  app.component('ElContainer', ElContainer)
}

export {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter,
}
