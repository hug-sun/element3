import { createApp } from 'vue'
import * as Element3 from 'element3'
import App from './play/index.vue'
import 'packages/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(Element3)

app.mount('#app')
