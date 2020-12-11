import { createApp } from 'vue'
import ProgressBar from './progress.vue'

const div = document.createElement('div')

const progress = createApp(ProgressBar).mount(div)
document.body.appendChild(progress.$el)

export default progress
