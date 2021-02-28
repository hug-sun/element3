import ElPagination from './src/Pagination.vue'

/* istanbul ignore next */
ElPagination.install = function (app) {
  app.component(ElPagination.name, ElPagination)
}

export { ElPagination }
