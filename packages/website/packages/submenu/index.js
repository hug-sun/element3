import ElSubmenu from '../menu/Submenu.vue'

/* istanbul ignore next */
ElSubmenu.install = function (app) {
  app.component(ElSubmenu.name, ElSubmenu)
}

export default ElSubmenu
