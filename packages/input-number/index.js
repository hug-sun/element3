import ElInputNumber from './src/input-number'

/* istanbul ignore next */
ElInputNumber.install = function(app) {
  app.component(ElInputNumber.name, ElInputNumber)
}

export default ElInputNumber
