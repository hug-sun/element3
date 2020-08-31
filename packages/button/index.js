import ElButton from './Button'

/* istanbul ignore next */
ElButton.install = function (app) {
  app.component(ElButton.name, ElButton)
}

export default ElButton
