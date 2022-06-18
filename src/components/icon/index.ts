// 入口模板 提供isntall方法

import ElIcon from './Icon.vue'

ElIcon.install = function (app) {
  app.component('ElIcon', ElIcon)
}

export { ElIcon }
