import ElTag from './src/Tag.vue'

/* istanbul ignore next */
ElTag.install = function (app) {
  app.component(ElTag.name, ElTag)
}

export { ElTag }
