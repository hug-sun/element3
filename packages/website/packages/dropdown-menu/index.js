import ElDropdownMenu from '../dropdown/src/dropdown-menu'

/* istanbul ignore next */
ElDropdownMenu.install = function (app) {
  app.component(ElDropdownMenu.name, ElDropdownMenu)
}

export default ElDropdownMenu
