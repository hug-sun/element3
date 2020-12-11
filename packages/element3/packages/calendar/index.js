import ElCalendar from './Calendar'

/* istanbul ignore next */
ElCalendar.install = function (app) {
  app.component(ElCalendar.name, ElCalendar)
}

export default ElCalendar
