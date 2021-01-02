import ElCard from './src/Card.vue'

/* istanbul ignore next */
ElCard.install = function (app) {
  app.component(ElCard.name, ElCard)
}

export { ElCard }
