import ElDialog from './Dialog'

/* istanbul ignore next */
ElDialog.install = function (app) {
  app.component(ElDialog.name, ElDialog)
}

export default ElDialog
