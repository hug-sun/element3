import Carousel from './src/main'

/* istanbul ignore next */
Carousel.install = function(app) {
  app.component(Carousel.name, Carousel)
}

export default Carousel
