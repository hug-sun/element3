import {createApp} from 'vue';
import ProgressBar from './progress.vue';

// Vue.prototype.$bar = new Vue(ProgressBar).$mount();
const progress = createApp(ProgressBar).mount()
document.body.appendChild(Vue.prototype.$bar.$el);

export default progress
