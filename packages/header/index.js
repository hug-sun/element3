import ElHeader from './Header'

/* istanbul ignore next */
ElHeader.install = function (app) {
  app.component(ElHeader.name, ElHeader)
}

export default ElHeader
