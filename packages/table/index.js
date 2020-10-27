import ElTable from './Table.vue'

/* istanbul ignore next */
ElTable.install = function (app) {
  app.component(ElTable.name, ElTable)
}

export default ElTable
