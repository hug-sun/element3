import ElCheckboxButton from '../checkbox/src/checkbox-button.vue'

/* istanbul ignore next */
ElCheckboxButton.install = function(app) {
  app.component(ElCheckboxButton.name, ElCheckboxButton)
}

export default ElCheckboxButton
