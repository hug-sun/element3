import ElTabs from './src/tabs'

/* istanbul ignore next */
ElTabs.install = function (app) {
  app.component(ElTabs.name, ElTabs)
}

export default ElTabs
