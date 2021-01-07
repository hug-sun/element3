import directive from './directive'
import service from './service'

export default {
  install(app) {
    app.use(directive)
  },
  service,
  directive
}
