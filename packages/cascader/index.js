import Cascader from './src/cascader'

/* istanbul ignore next */
Cascader.install = function (app) {
  app.component(Cascader.name, Cascader)
}

export default Cascader
