import Card from './src/main'

/* istanbul ignore next */
Card.install = function (app) {
  app.component(Card.name, Card)
}

export default Card
