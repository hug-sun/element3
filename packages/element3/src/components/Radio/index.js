import ElRadio from './src/Radio.vue'

/* istanbul ignore next */
ElRadio.install = function (app) {
  app.component(ElRadio.name, ElRadio)
}

export { ElRadio }
