import ElBreadcrumbItem from '../breadcrumb/BreadcrumbItem'

/* istanbul ignore next */
ElBreadcrumbItem.install = function (app) {
  app.component(ElBreadcrumbItem.name, ElBreadcrumbItem)
}

export default ElBreadcrumbItem
