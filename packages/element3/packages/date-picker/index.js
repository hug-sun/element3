import DatePicker from './src/picker/date-picker'

/* istanbul ignore next */
DatePicker.install = function install(app) {
  app.component(DatePicker.name, DatePicker)
}

export default DatePicker
