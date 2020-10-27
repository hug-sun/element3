import ElAvatar from './Avatar.vue'

/* istanbul ignore next */
ElAvatar.install = function (app) {
  app.component(ElAvatar.name, ElAvatar)
}

export default ElAvatar
