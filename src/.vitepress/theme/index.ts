import Theme from 'vitepress/theme'
// import 'vitepress-theme-demoblock/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'
import Element3 from '../../'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(Element3)
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
  },
}

