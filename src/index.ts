import { version } from '../package.json'
import { ElButton } from './components/button/'
import { ElDivider } from './components/divider/'
import { ElLink } from './components/link/'

const components = [
  ElButton,
  ElDivider,
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
  ElButton,
}
export default element3
