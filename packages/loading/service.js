import loadingVue from './Loading.vue'
import { createComponent, unmountComponent } from 'element-ui/src/use/component'
import { addClass, removeClass, getStyle } from 'element-ui/src/utils/dom'
import { PopupManager } from 'element-ui/src/utils/popup'
import merge from 'element-ui/src/utils/merge'

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
  addStyle(options, parent, instance.ctx)
  if (
    instance.originalPosition !== 'absolute' &&
    instance.originalPosition !== 'fixed'
  ) {
    addClass(parent, 'el-loading-parent--relative')
  }

  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden')
  }

  parent.appendChild(instance.ctx.$el)

  if (options.fullscreen) {
    fullscreenLoading = instance
  }

  instance.close = close

  return instance
}

const close = function () {
  this.ctx.close()
}

const addStyle = (options, parent, ctx) => {
  const maskStyle = {}
  if (options.fullscreen) {
    ctx.originalPosition = getStyle(document.body, 'position')
    ctx.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    ctx.originalPosition = getStyle(document.body, 'position')
    ;['top', 'left'].forEach((property) => {
      const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
      maskStyle[property] =
        options.target.getBoundingClientRect()[property] + //         document.body[scroll] +
        document.documentElement[scroll] +
        'px'
    })
    ;['height', 'width'].forEach((property) => {
      maskStyle[property] =
        options.target.getBoundingClientRect()[property] + 'px'
    })
  } else {
    ctx.originalPosition = getStyle(parent, 'position')
  }
  Object.keys(maskStyle).forEach((property) => {
    ctx.$el.style[property] = maskStyle[property]
  })
}
export default Loading
