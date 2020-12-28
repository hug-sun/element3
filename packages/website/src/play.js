import { createApp } from 'vue'
import * as Element3 from 'element3'
import App from './play/index.vue'
import 'element3/lib/theme-chalk/index.css'

const app = createApp(App)
app.use(Element3)

app.mount('#app')

export default app
