import ElAlert from './Alert.vue'

/* istanbul ignore next */
ElAlert.install = function (app) {
  app.component(ElAlert.name, ElAlert)
}

export default ElAlert
