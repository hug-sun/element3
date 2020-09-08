// 用于构建时的入口
import ElButton from '../packages/button'
import ElSwitch from '../packages/switch'
import ElProgress from '../packages/progress'
import ElLink from '../packages/link'
import ElIcon from '../packages/icon'
import { version } from '../package.json'

const components = [ElButton, ElSwitch, ElProgress, ElLink, ElIcon]

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

const elementUI = {
  version,
  install
}

export { ElButton, ElSwitch, ElProgress, ElLink, ElIcon }

export default elementUI
