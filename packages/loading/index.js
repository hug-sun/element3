import directive from './src/directive'
import service from './src/index'

export default {
  install(app) {
    app.use(directive)
    app.config.globalProperties.$loading = service
  },
  directive,
  service
}
