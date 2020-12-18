import ElButton from './src/Button.vue'

ElButton.install = function (app) {
  app.component(ElButton.name, ElButton)
}

export { ElButton }
