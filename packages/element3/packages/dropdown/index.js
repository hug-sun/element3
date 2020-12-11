import ElDropdown from './src/dropdown'

/* istanbul ignore next */
ElDropdown.install = function (app) {
  app.component(ElDropdown.name, ElDropdown)
}

export default ElDropdown
