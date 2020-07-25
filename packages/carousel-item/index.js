import ElCarouselItem from '../carousel/src/item'

/* istanbul ignore next */
ElCarouselItem.install = function(app) {
  app.component(ElCarouselItem.name, ElCarouselItem)
}

export default ElCarouselItem
