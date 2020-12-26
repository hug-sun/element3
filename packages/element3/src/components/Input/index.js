import ElInput from './src/Input.vue'

/* istanbul ignore next */
ElInput.install = function (app) {
  app.component(ElInput.name, ElInput)
}

export { ElInput }
