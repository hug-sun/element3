import Pagination from './Pagination'

/* istanbul ignore next */
Pagination.install = function (app) {
  app.component(Pagination.name, Pagination)
}

export default Pagination
