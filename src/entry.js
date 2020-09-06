// 用于构建时的入口
import ElButton from '../packages/button'
import ElSwitch from '../packages/switch'
import ElProgress from '../packages/progress'
import { version } from '../package.json'

const components = [ElButton, ElSwitch, ElProgress]

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

const elementUI = {
  version,
  install
}

export { ElButton, ElSwitch, ElProgress }

export default elementUI
