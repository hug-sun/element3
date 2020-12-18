import ElSwitch from './src/Switch.vue'

/* istanbul ignore next */
ElSwitch.install = function (app) {
  app.component(ElSwitch.name, ElSwitch)
}

export { ElSwitch }
