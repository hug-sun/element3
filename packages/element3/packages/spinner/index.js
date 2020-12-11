import Spinner from './src/spinner'

/* istanbul ignore next */
Spinner.install = function (app) {
  app.component(Spinner.name, Spinner)
}

export default Spinner
