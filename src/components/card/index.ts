import ElCard from './Card.vue'

ElCard.install = function (app) {
  app.component('ElCard', ElCard)
}

export { ElCard }
