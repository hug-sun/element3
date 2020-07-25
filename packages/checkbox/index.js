import ElCheckbox from './src/checkbox'

/* istanbul ignore next */
ElCheckbox.install = function(app) {
  app.component(ElCheckbox.name, ElCheckbox)
}

export default ElCheckbox
