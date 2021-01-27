import ElNewTable from './src/Table.vue'

ElNewTable.install = function (app) {
  app.component(ElNewTable.name, ElNewTable)
}

export { ElNewTable }
