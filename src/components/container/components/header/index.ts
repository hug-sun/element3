import ElHeader from './Header.vue'

ElHeader.install = function (app) {
  app.component('ElHeader', ElHeader)
}

export { ElHeader }
export default ElHeader
