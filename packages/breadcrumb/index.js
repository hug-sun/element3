import ElBreadcrumb from './src/breadcrumb'

/* istanbul ignore next */
ElBreadcrumb.install = function(app) {
  app.component(ElBreadcrumb.name, ElBreadcrumb)
}

export default ElBreadcrumb
