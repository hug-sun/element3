import ElAlert from './Alert.vue'

ElAlert.install = function (app) {
  app.component('ElAlert', ElAlert)
}

export { ElAlert }
