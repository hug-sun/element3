import ElCard from './Card'

/* istanbul ignore next */
ElCard.install = function (app) {
  app.component(ElCard.name, ElCard)
}

export default ElCard
