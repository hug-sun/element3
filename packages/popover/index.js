import Popover from './Popover'
import directive from './directive'

/* istanbul ignore next */
Popover.install = function (app) {
  app.directive('popover', directive)
  app.component(Popover.name, Popover)
}
Popover.directive = directive

export default Popover
