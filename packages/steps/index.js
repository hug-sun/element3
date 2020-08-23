import Steps from './src/steps'

/* istanbul ignore next */
Steps.install = function (app) {
  app.component(Steps.name, Steps)
}

export default Steps
