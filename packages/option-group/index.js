import ElOptionGroup from '../select/src/option-group'

/* istanbul ignore next */
ElOptionGroup.install = function (app) {
  app.component(ElOptionGroup.name, ElOptionGroup)
}

export default ElOptionGroup
