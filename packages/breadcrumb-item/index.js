import ElBreadcrumbItem from '../breadcrumb/src/breadcrumb-item'

/* istanbul ignore next */
ElBreadcrumbItem.install = function(app) {
  app.component(ElBreadcrumbItem.name, ElBreadcrumbItem)
}

export default ElBreadcrumbItem
