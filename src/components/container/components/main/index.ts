import ElMain from './Main.vue'

ElMain.install = function (app) {
  app.component('ElMain', ElMain)
}

export { ElMain }
export default ElMain
