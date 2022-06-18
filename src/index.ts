import { version } from '../package.json'
import { ElDivider } from './components/divider/'
import { ElLink } from './components/link/'
import { ElIcon } from './components/icon/'
import '/theme/src/icon.scss'

const components = [
  ElDivider,
  ElIcon,
  ElLink,
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
  ElLink,
}
export default element3
