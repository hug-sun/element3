import ElCheckboxGroup from '../checkbox/src/checkbox-group.vue'

/* istanbul ignore next */
ElCheckboxGroup.install = function(app) {
  app.component(ElCheckboxGroup.name, ElCheckboxGroup)
}

export default ElCheckboxGroup
