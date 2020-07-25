import ElButtonGroup from '../button/src/button-group'

/* istanbul ignore next */
ElButtonGroup.install = function(app) {
  app.component(ElButtonGroup.name, ElButtonGroup)
}

export default ElButtonGroup
