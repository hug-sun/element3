import ElMain from './Main'

/* istanbul ignore next */
ElMain.install = function (app) {
  app.component(ElMain.name, ElMain)
}

export { ElMain }
export default ElMain
