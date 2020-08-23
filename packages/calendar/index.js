import Calendar from './src/main'

/* istanbul ignore next */
Calendar.install = function (app) {
  app.component(Calendar.name, Calendar)
}

export default Calendar
