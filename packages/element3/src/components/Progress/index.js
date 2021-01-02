import ElProgress from './src/Progress.vue'

ElProgress.install = function (app) {
  app.component(ElProgress.name, ElProgress)
}

export { ElProgress }
