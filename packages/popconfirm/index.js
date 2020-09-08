import Popconfirm from './src/main'

/* istanbul ignore next */
Popconfirm.install = function (app) {
  app.component(Popconfirm.name, Popconfirm)
}

export default Popconfirm
