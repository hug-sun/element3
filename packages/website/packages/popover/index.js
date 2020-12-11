import ElPopover from './Popover'
import directive from './directive'

/* istanbul ignore next */
ElPopover.install = function (app) {
  app.directive('popover', directive)
  app.component(ElPopover.name, ElPopover)
}

export default ElPopover
