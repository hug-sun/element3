import { version } from '../package.json'
import { ElDivider } from './components/divider/'
import { ElLink } from './components/link/'

const components = [
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
  ElDivider,
}
export default element3
