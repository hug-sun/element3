import ElTableColumn from './src/TableColumn.vue'

ElTableColumn.install = function (app) {
  app.component(ElTableColumn.name, ElTableColumn)
}

export { ElTableColumn as ElNewTableColumn }
