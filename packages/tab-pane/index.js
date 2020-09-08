import TabPane from './tab-pane.vue'

/* istanbul ignore next */
TabPane.install = function (app) {
  app.component(TabPane.name, TabPane)
}

export default TabPane