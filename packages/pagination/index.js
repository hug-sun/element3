import Pagination from './src/pagination'

/* istanbul ignore next */
Pagination.install = function (app) {
  app.component(Pagination.name, Pagination)
}

export default Pagination
