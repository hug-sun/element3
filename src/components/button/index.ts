import ElButton from './Button.vue'

ElButton.install = function (app) {
  app.component('ElButton', ElButton)
}

export { ElButton }
