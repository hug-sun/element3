import ElOption from './Option'

/* istanbul ignore next */
ElOption.install = function (app) {
  app.component(ElOption.name, ElOption)
}

export default ElOption
