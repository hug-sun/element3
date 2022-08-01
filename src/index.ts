import { version } from '../package.json'
import { ElDivider } from './components/divider/'
import { ElAvatar } from './components/avatar'
import { ElLink } from './components/link/'
import { ElIcon } from './components/icon/'
import { ElBadge } from './components/badge/'
import { ElAlert } from './components/alert'
import { ElProgress } from './components/progress'

import {
  ElAside,
  ElContainer,
  ElFooter,
  ElHeader,
  ElMain,
} from './components/container/'
import {
  ElCol,
  ElRow,
} from './components/layout'
import { ElEmpty } from './components/empty/'
import { ElCard } from './components/card/'
import { ElButton } from './components/button/'
import { ElTag } from './components/tag/'
import { ElForm } from './components/form/'
import { ElRadio } from './components/radio/'
import { ElRadioGroup } from './components/radioGroup/'
import { ElRadioButton } from './components/radioButton/'
import '/theme/src/icon.scss'

const components = [
  ElDivider,
  ElIcon,
  ElBadge,
  ElAvatar,
  ElLink,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElEmpty,
  ElCard,
  ElButton,
  ElTag,
  ElAlert,
  ElForm,
  ElProgress,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
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
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElEmpty,
  ElCard,
  ElButton,
  ElTag,
  ElAlert,
  ElForm,
  ElProgress,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
}
export default element3
