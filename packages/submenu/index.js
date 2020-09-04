import ElSubmenu from '../menu/src/submenu'

/* istanbul ignore next */
ElSubmenu.install = function (app) {
  app.component(ElSubmenu.name, ElSubmenu)
}

export default ElSubmenu
