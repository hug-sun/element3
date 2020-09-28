import ElUpload from './src/index.vue'

/* istanbul ignore next */
ElUpload.install = function (app) {
  app.component(ElUpload.name, ElUpload)
}

export default ElUpload
