import ElSubmenu from '../menu/Submenu'

/* istanbul ignore next */
ElSubmenu.install = function (app) {
  app.component(ElSubmenu.name, ElSubmenu)
}

export default ElSubmenu
