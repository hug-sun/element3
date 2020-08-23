import Popover from './src/main'
import directive from './src/directive'
// import Vue from 'vue'

// Vue.directive('popover', directive)

/* istanbul ignore next */
Popover.install = function (app) {
  app.directive('popover', directive)
  app.component(Popover.name, Popover)
}
Popover.directive = directive

export default Popover
