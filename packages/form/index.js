import ElForm from './src/form'

/* istanbul ignore next */
ElForm.install = function (app) {
  app.component(ElForm.name, ElForm)
}

export default ElForm
