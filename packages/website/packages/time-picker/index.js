import TimePicker from '../date-picker/src/picker/time-picker'

/* istanbul ignore next */
TimePicker.install = function (app) {
  app.component(TimePicker.name, TimePicker)
}

export default TimePicker
