import Table from './src/table.vue'

Table.install = function (app) {
  app.component(Table.name, Table)
}

export default Table
