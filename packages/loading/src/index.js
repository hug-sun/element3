import ElLoading from './loading.vue'
import { nextTick, createApp } from 'vue'
import merge from 'element-ui/src/utils/merge'
import afterLeave from 'element-ui/src/utils/after-leave'
import { PopupManager } from 'element-ui/src/utils/popup'
import { addClass, removeClass, getStyle } from 'element-ui/src/utils/dom'

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
}

let fullscreenLoading

function close() {
  if (this.fullscreen) {
    fullscreenLoading = undefined
  }

  afterLeave(
    this,
    (_) => {
      const target = this.fullscreen || this.body ? document.body : this.target
      removeClass(target, 'el-loading-parent--relative')
      removeClass(target, 'el-loading-parent--hidden')
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    },
    300
  )
  this.visible = false
}

const addStyle = (options, parent, instance) => {
  const maskStyle = {}

  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position')
    instance.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position')
  } else {
    instance.originalPosition = getStyle(parent, 'position')
  }

  if (options.body) {
    const boundingClientRect = options.target.getBoundingClientRect()

    ;['top', 'left'].forEach((property) => {
      const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
      maskStyle[property] =
        boundingClientRect[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px'
    })
    ;['height', 'width'].forEach((property) => {
      maskStyle[property] = boundingClientRect[property] + 'px'
    })
  }

  Object.keys(maskStyle).forEach((property) => {
    instance.$el.style[property] = maskStyle[property]
  })
}

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

  const instance = createApp(ElLoading)
    .mixin({ methods: { close } })
    .mount(document.createElement('div'))

  instance.text = options.text
  instance.body = options.body
  instance.lock = options.lock
  instance.spinner = options.spinner
  instance.background = options.background
  instance.fullscreen = options.fullscreen
  instance.customClass = options.customClass

  addStyle(options, options.target, instance)

  if (
    instance.originalPosition !== 'absolute' &&
    instance.originalPosition !== 'fixed'
  ) {
    addClass(options.target, 'el-loading-parent--relative')
  }
  if (options.fullscreen && options.lock) {
    addClass(options.target, 'el-loading-parent--hidden')
  }

  options.target.appendChild(instance.$el)

  nextTick(() => {
    instance.visible = true
  })

  if (options.fullscreen) {
    fullscreenLoading = instance
  }

  return instance
}

export default Loading
