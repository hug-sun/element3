import ElBreadcrumb from './Breadcrumb'

/* istanbul ignore next */
ElBreadcrumb.install = function (app) {
  app.component(ElBreadcrumb.name, ElBreadcrumb)
}

export default ElBreadcrumb
