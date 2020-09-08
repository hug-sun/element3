// 用于构建时的入口
import ElButton from '../packages/button'
import { version } from '../package.json'

const components = [ElButton]

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

const elementUI = {
  version,
  install
}

export { ElButton }

export default elementUI
