import Tooltip from './Tooltip'

/* istanbul ignore next */
Tooltip.install = function (app) {
  app.component(Tooltip.name, Tooltip)
}

export default Tooltip
