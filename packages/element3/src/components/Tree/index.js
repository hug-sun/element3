import ElTree from './src/Tree.vue'

ElTree.install = function (app) {
  app.component(ElTree.name, ElTree)
}

export { ElTree }
