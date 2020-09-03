import ColorPicker from './src/ColorPicker'

/* istanbul ignore next */
ColorPicker.install = function (app) {
  app.component(ColorPicker.name, ColorPicker)
}

export default ColorPicker
