import ElImage from './Image'

/* istanbul ignore next */
ElImage.install = function (app) {
  app.component(ElImage.name, ElImage)
}

export default ElImage
