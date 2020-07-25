import ElInput from './src/input'

/* istanbul ignore next */
ElInput.install = function(app) {
  app.component(ElInput.name, ElInput)
}

export default ElInput
