import TimeSelect from '../date-picker/src/picker/time-select'

/* istanbul ignore next */
TimeSelect.install = function (app) {
  app.component(TimeSelect.name, TimeSelect)
}

export default TimeSelect
