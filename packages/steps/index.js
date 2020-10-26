import ElSteps from './src/steps'

/* istanbul ignore next */
ElSteps.install = function (app) {
  app.component(ElSteps.name, ElSteps)
}

export default ElSteps
