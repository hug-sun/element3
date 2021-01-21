import ElNewTable from './src/table.vue'

ElNewTable.install = function (app) {
  app.component(ElNewTable.name, ElNewTable)
}

export { ElNewTable }
