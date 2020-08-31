import Backtop from './src/main'

/* istanbul ignore next */
Backtop.install = function (app) {
  app.component(Backtop.name, Backtop)
}

export default Backtop
