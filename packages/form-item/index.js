import ElFormItem from '../form/src/form-item'

/* istanbul ignore next */
ElFormItem.install = function (app) {
  app.component(ElFormItem.name, ElFormItem)
}

export default ElFormItem
