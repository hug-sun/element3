import ElContainer from './Container.vue'

/* istanbul ignore next */
ElContainer.install = function (app) {
  app.component(ElContainer.name, ElContainer)
}

export default ElContainer
