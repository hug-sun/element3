import ElPagination from './Pagination'

/* istanbul ignore next */
ElPagination.install = function (app) {
  app.component(ElPagination.name, ElPagination)
}

export default ElPagination
