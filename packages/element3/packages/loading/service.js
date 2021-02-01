import loadingVue from './Loading.vue'
import {
  createComponent,
  unmountComponent
} from '../../src/composables/component'
import { removeClass } from '../../src/utils/dom'
import merge from '../../src/utils/merge'
import { addStyle } from './lib'

const defaults = {
  target: null,
  body: false,
  fullscreen: true,
  lock: false,
  text: null,
  spinner: null,
  background: null,
  customClass: ''
}
let fullscreenLoading
const Loading = (options = {}) => {
  // if (Vue.prototype.$isServer) return
  options = merge({}, defaults, options)

  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target)
  }
  options.target = options.target || document.body
  if (options.target !== document.body) {
    options.fullscreen = false
  } else {
    options.body = true
  }

  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading
  }

  const parent = options.body ? document.body : options.target
  const instance = createComponent(loadingVue, {
    ...options,
    visible: true,
    onAfterLeave() {
      if (options.fullscreen) {
        fullscreenLoading = undefined
      }
      const target =
        options.fullscreen || options.body ? document.body : options.target
      removeClass(target, 'el-loading-parent--relative')
      removeClass(target, 'el-loading-parent--hidden')
      unmountComponent(instance)
    }
  })
  addStyle(options, parent, instance.proxy)

  parent.appendChild(instance.proxy.$el)

  if (options.fullscreen) {
    fullscreenLoading = instance
  }

  instance.close = close

  return instance
}

const close = function () {
  this.proxy.close()
}

export default Loading
