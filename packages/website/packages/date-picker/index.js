import DatePicker from './src/picker/date-picker'
import mitt from 'mitt'

/* istanbul ignore next */
DatePicker.install = function install(app) {
  app.component(DatePicker.name, DatePicker)
}

export default DatePicker
export function useDateEmitter() {
  const { emit, on } = mitt()
  return {
    trigger: (type, ...args) => emit(type, { args }),
    on: (type, fn) => on(type, ({ args = [] }) => fn(...args))
  }
}
