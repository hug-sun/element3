import ElTooltip from './Tooltip'

/* istanbul ignore next */
ElTooltip.install = function (app) {
  app.component(ElTooltip.name, ElTooltip)
}

export default ElTooltip
