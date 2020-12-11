import ElStep from '../steps/src/step'

/* istanbul ignore next */
ElStep.install = function (app) {
  app.component(ElStep.name, ElStep)
}

export default ElStep
