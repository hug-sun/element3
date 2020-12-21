import ElBadge from './src/Badge.vue'

/* istanbul ignore next */
ElBadge.install = function (app) {
  app.component(ElBadge.name, ElBadge)
}

export { ElBadge }
