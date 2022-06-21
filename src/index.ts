import { version } from '../package.json'
import { ElDivider } from './components/divider/'
import { ElAvatar } from './components/avatar'
import { ElLink } from './components/link/'
import { ElIcon } from './components/icon/'
import { ElBadge } from './components/badge/'
import { ElTag } from './components/tag/'
import { ElEmpty } from './components/empty/'
import { ElCard } from './components/card/'
import { ElButton } from './components/button/'
import '/theme/src/icon.scss'

const components = [
  ElDivider,
  ElIcon,
  ElBadge,
  ElAvatar,
  ElLink,
  ElTag,
  ElEmpty,
  ElCard,
  ElButton,
]
function install(app) {
  components.forEach((component) => {
    app.use(component)
  })
}

const element3 = {
  version,
  install,
}

export {
  ElDivider,
  ElIcon,
  ElBadge,
  ElAvatar,
  ElLink,
  ElTag,
  ElEmpty,
  ElCard,
  ElButton,
}
export default element3
