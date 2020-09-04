import ElCarousel from './Carousel.vue'

/* istanbul ignore next */
ElCarousel.install = function (app) {
  app.component(ElCarousel.name, ElCarousel)
}

export default ElCarousel
