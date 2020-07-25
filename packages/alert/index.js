import Alert from './src/main'

/* istanbul ignore next */
Alert.install = function(app) {
  app.component(Alert.name, Alert)
}

export default Alert
