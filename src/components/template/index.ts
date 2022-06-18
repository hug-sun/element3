// 入口模板 提供isntall方法

import ElTemplate from './Template.vue'

ElTemplate.install = function (app) {
  app.component('ElTemplate', ElTemplate)
}

export { ElTemplate }
