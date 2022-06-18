import { version } from '../package.json'
import { ElDivider } from './components/divider/'
import { ElIcon } from './components/icon/'
import '/theme/src/icon.scss'
const components = [
  ElDivider,
  ElIcon,
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
}
export default element3
