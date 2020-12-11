import ElTabs from './Tabs'

/* istanbul ignore next */
ElTabs.install = function (app) {
  app.component(ElTabs.name, ElTabs)
}

export default ElTabs
