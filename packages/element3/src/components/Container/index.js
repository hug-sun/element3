import ElContainer from './src/Container.vue'

/* istanbul ignore next */
ElContainer.install = function (app) {
  app.component(ElContainer.name, ElContainer)
}

export { ElContainer }
