import Step from '../steps/src/step'

/* istanbul ignore next */
Step.install = function (app) {
  app.component(Step.name, Step)
}

export default Step
