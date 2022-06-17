import ElLink from './Link.vue'

ElLink.install = function (app) {
  app.component('ElLink', ElLink)
}

export { ElLink }