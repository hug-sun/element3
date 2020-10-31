import ElDrawer from './Drawer'

/* istanbul ignore next */
ElDrawer.install = function (app) {
  app.component(ElDrawer.name, ElDrawer)
}

export default ElDrawer
