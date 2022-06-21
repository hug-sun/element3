import ElBadge from './Badge.vue'

ElBadge.install = function (app) {
  app.component('ElBadge', ElBadge)
}

export { ElBadge }
