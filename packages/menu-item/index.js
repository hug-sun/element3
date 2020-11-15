import ElMenuItem from '../menu/MenuItem.vue'

/* istanbul ignore next */
ElMenuItem.install = function (app) {
  app.component(ElMenuItem.name, ElMenuItem)
}

export default ElMenuItem
