import CascaderPanel from './src/cascader-panel'

/* istanbul ignore next */
CascaderPanel.install = function (app) {
  app.component(CascaderPanel.name, CascaderPanel)
}

export default CascaderPanel
