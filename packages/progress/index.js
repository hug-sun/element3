import ElProgress from './Progress'

/* istanbul ignore next */
ElProgress.install = function (app) {
  app.component(ElProgress.name, ElProgress)
}

export default ElProgress
