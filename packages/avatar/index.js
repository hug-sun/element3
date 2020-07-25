import Avatar from './src/main'

/* istanbul ignore next */
Avatar.install = function(app) {
  app.component(Avatar.name, Avatar)
}

export default Avatar
