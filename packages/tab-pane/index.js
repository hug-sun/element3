import ElTabPane from './TabPane'

/* istanbul ignore next */
ElTabPane.install = function (app) {
  app.component(ElTabPane.name, ElTabPane)
}

export default ElTabPane
