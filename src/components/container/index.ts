import ElContainer from './Container.vue'

ElContainer.install = function (app) {
  app.component('ElContainer', ElContainer)
}

export { ElContainer }
export default ElContainer
