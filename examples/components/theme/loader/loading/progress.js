import {createApp} from 'vue';
import ProgressBar from './progress.vue';

// Vue.prototype.$bar = new Vue(ProgressBar).$mount();
const div = document.createElement('div');

const progress = createApp(ProgressBar).mount(div)
console.log(progress.$el)
document.body.appendChild(progress.$el);

export default progress
