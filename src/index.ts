import {ElButton} from './components/button/'
import {ElDivider} from './components/divider/'
import { ElAvatar } from './components/avatar'
import { version } from '../package.json'


const components = [
  ElButton,
  ElDivider,
  ElAvatar,
]
function install (app) {
  components.forEach(component=>{
    app.use(component)
  })
}

const element3 = {
  version,
  install
}

export {
  ElButton,
  ElDivider,
  ElAvatar
}
export default element3
