import ElProgress from './src/progress'

/* istanbul ignore next */
ElProgress.install = function(app) {
  app.component(ElProgress.name, ElProgress)
}

export default ElProgress
