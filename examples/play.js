import {createApp} from 'vue';
import Element from 'main/index.js';
import App from './play/index.vue';
import 'packages/theme-chalk/src/index.scss';


const app = createApp({ // eslint-disable-line
  render: h => h(App)
})
app.use(Element);

app.mount('#app')
