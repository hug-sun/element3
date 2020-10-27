import ElTree from './Tree.vue'

/* istanbul ignore next */
ElTree.install = function (app) {
  app.component(ElTree.name, ElTree)
}

export default ElTree
