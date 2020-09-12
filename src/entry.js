// 用于构建时的入口
import ElContainer from '../packages/container'
import ElButton from '../packages/button'
import ElSwitch from '../packages/switch'
import ElProgress from '../packages/progress'
import ElLink from '../packages/link'
import ElIcon from '../packages/icon'
import ElBreadcrumb from '../packages/breadcrumb'
import ElBreadcrumbItem from '../packages/breadcrumb-item'
import { version } from '../package.json'

const components = [
  ElContainer,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem
]

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

const elementUI = {
  version,
  install
}

export {
  ElContainer,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem
}

export default elementUI
