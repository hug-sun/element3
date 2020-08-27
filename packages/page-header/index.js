import PageHeader from './PageHeader'

/* istanbul ignore next */
PageHeader.install = function (app) {
  app.component(PageHeader.name, PageHeader)
}

export default PageHeader
