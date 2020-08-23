import Avatar from './Avatar.vue'

/* istanbul ignore next */
Avatar.install = function (app) {
  app.component(Avatar.name, Avatar)
}

export default Avatar
