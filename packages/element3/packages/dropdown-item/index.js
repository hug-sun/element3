import ElDropdownItem from '../dropdown/src/dropdown-item'

/* istanbul ignore next */
ElDropdownItem.install = function (app) {
  app.component(ElDropdownItem.name, ElDropdownItem)
}

export default ElDropdownItem
