import Drawer from './src/main'

/* istanbul ignore next */
Drawer.install = function(app) {
  app.component(Drawer.name, Drawer)
}

export default Drawer
