import Rate from './src/main'

/* istanbul ignore next */
Rate.install = function(app) {
  app.component(Rate.name, Rate)
}

export default Rate
