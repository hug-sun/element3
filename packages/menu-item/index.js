import ElMenuItem from '../menu/src/menu-item'

/* istanbul ignore next */
ElMenuItem.install = function (app) {
  app.component(ElMenuItem.name, ElMenuItem)
}

export default ElMenuItem
