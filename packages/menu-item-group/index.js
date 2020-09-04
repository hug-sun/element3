import ElMenuItemGroup from '../menu/src/menu-item-group'

/* istanbul ignore next */
ElMenuItemGroup.install = function (app) {
  app.component(ElMenuItemGroup.name, ElMenuItemGroup)
}

export default ElMenuItemGroup
