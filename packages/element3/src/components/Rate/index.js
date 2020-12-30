import ElRate from './src/Rate'

ElRate.install = function (app) {
  app.component(ElRate.name, ElRate)
}

export { ElRate }
