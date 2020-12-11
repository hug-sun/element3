import ElScrollbar from './Scrollbar'

/* istanbul ignore next */
ElScrollbar.install = function (app) {
  app.component(ElScrollbar.name, ElScrollbar)
}

export default ElScrollbar
