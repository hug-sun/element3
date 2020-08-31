import Select from './src/select'

/* istanbul ignore next */
Select.install = function (app) {
  app.component(Select.name, Select)
}

export default Select
