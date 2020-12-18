import ElLink from './src/Link.vue'

/* istanbul ignore next */
ElLink.install = function (app) {
  app.component(ElLink.name, ElLink)
}

export { ElLink }
