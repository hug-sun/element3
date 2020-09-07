import ElProgress from './Progress.vue'

ElProgress.install = function (app) {
  app.component(ElProgress.name, ElProgress)
}

export default ElProgress
