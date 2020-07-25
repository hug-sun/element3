import Badge from './src/main'

/* istanbul ignore next */
Badge.install = function(app) {
  app.component(Badge.name, Badge)
}

export default Badge
