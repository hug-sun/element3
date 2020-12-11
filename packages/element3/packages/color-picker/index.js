import ColorPicker from './src/main'

/* istanbul ignore next */
ColorPicker.install = function (app) {
  app.component(ColorPicker.name, ColorPicker)
}

export default ColorPicker
