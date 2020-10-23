// 用于构建时的入口
import ElAlert from '../packages/alert'
import ElContainer from '../packages/container'
import ElButton from '../packages/button'
import ElSwitch from '../packages/switch'
import ElProgress from '../packages/progress'
import ElLink from '../packages/link'
import ElIcon from '../packages/icon'
import ElBreadcrumb from '../packages/breadcrumb'
import ElBreadcrumbItem from '../packages/breadcrumb-item'
import ElBacktop from '../packages/backtop'
import ElTree from '../packages/tree'
import ElMenu from '../packages/menu'
import ElMenuItem from '../packages/menu-item'
import ElSubmenu from '../packages/submenu'
import ElMenuItemGroup from '../packages/menu-item-group'
import ElPagination from '../packages/pagination'
import { version } from '../package.json'

const components = [
  ElAlert,
  ElContainer,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElBacktop,
  ElTree,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElMenuItemGroup,
  ElPagination
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
  ElAlert,
  ElContainer,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElBacktop,
  ElTree,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElMenuItemGroup,
  ElPagination
}

export default elementUI
