import Scrollbar from './Scrollbar'

/* istanbul ignore next */
Scrollbar.install = function (app) {
  app.component(Scrollbar.name, Scrollbar)
}

export default Scrollbar
