// import Tooltip from './src/main.vue'
import Tooltip from './src/main-test'

/* istanbul ignore next */
Tooltip.install = function (app) {
  app.component(Tooltip.name, Tooltip)
}

export default Tooltip
