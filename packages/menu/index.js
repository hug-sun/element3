import ElMenu from './Menu.vue'

/* istanbul ignore next */
ElMenu.install = function (app) {
  app.component(ElMenu.name, ElMenu)
}

export default ElMenu
