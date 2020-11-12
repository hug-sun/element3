import Table from './src/table.vue'
import TableColumn from './src/table-column'

export default (app) => {
  app.component(Table.name, Table)
  app.component(TableColumn.name, TableColumn)
}

export { Table, TableColumn }
