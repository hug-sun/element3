import Calendar from './Calendar'

/* istanbul ignore next */
Calendar.install = function (app) {
  app.component(Calendar.name, Calendar)
}

export default Calendar
