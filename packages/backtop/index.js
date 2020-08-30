import Backtop from './src/main'
// import Backtop from './Backtop'

/* istanbul ignore next */
Backtop.install = function (app) {
  app.component(Backtop.name, Backtop)
}

export default Backtop
