import ElOption from '../select/src/option'

/* istanbul ignore next */
ElOption.install = function (app) {
  app.component(ElOption.name, ElOption)
}

export default ElOption
