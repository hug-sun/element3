import ElProgress from './Progress.vue'

ElProgress.install = function (app) {
  app.component('ElProgress', ElProgress)
}

export { ElProgress }
