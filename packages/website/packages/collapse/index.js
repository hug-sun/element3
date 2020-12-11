import ElCollapse from './src/collapse'

/* istanbul ignore next */
ElCollapse.install = function (app) {
  app.component(ElCollapse.name, ElCollapse)
}

export default ElCollapse
