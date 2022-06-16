import {ElButton} from './components/button/'
import { version } from '../package.json'


const components = [
  ElButton
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
  ElButton
}
export default element3
