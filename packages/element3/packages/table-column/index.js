import ElTableColumn from '../table/src/table-column'

/* istanbul ignore next */
ElTableColumn.install = function (app) {
  app.component(ElTableColumn.name, ElTableColumn)
}

export default ElTableColumn
