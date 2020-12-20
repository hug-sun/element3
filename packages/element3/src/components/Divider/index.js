import ElDivider from './src/Divider'

/* istanbul ignore next */
ElDivider.install = function (app) {
  app.component(ElDivider.name, ElDivider)
}

export { ElDivider }
