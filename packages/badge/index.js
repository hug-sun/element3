import ElBadge from './Badge.vue'

/* istanbul ignore next */
ElBadge.install = function (app) {
  app.component(ElBadge.name, ElBadge)
}

export default ElBadge
