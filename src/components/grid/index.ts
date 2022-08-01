import ElGrid from './Grid.vue'
import ElGridItem from './GridItem.vue'

ElGrid.install = function (app) {
  app.component('ElGrid', ElGrid)
}

ElGridItem.install = function (app) {
  app.component('ElGridItem', ElGridItem)
}

export { ElGrid }
export { ElGridItem }
export { ElGridItem as ElGi }
