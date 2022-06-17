import { version } from '../package.json'
import { ElButton } from './components/button/'
import { ElDivider } from './components/divider/'

const components = [
  ElButton,
  ElDivider,
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
