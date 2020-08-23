import Slider from './src/main'

/* istanbul ignore next */
Slider.install = function (app) {
  app.component(Slider.name, Slider)
}

export default Slider
