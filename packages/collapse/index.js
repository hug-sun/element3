import ElCollapse from './Collapse'

/* istanbul ignore next */
ElCollapse.install = function (app) {
  app.component(ElCollapse.name, ElCollapse)
}

export default ElCollapse
