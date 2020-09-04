import ElTable from './src/table'

/* istanbul ignore next */
ElTable.install = function (app) {
  app.component(ElTable.name, ElTable)
}

export default ElTable
