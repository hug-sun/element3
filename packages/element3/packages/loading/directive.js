import { nextTick } from 'vue'
import Loading from './Loading.vue'
import { removeClass } from '../../src/utils/dom'

import { createComponent } from '../../src/composables/component'
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

const toggleLoading = (el, binding) => {
  if (binding.value) {
    nextTick(() => {
      let parentEl = document.body
      if (!binding.modifiers.fullscreen) {
        parentEl = el
      }
      addStyle(el.options, parentEl, el.instance)
      el.instance.show()
      parentEl.appendChild(el.mask)
    })
  } else {
    el.instance.close()
  }
}

const loadingDirective = {
  mounted: function (el, binding, vnode) {
    const textExr = el.getAttribute('element-loading-text')
    const spinnerExr = el.getAttribute('element-loading-spinner')
    const backgroundExr = el.getAttribute('element-loading-background')
    const customClassExr = el.getAttribute('element-loading-custom-class')
    const vm = vnode.context

    const options = merge({}, defaults, {
      text: (vm && vm[textExr]) || textExr,
      spinner: (vm && vm[spinnerExr]) || spinnerExr,
      background: (vm && vm[backgroundExr]) || backgroundExr,
      customClass: (vm && vm[customClassExr]) || customClassExr,
      fullscreen: !!binding.modifiers.fullscreen
    })

    const mask = createComponent(Loading, {
      ...options,
      onAfterLeave() {
        el.domVisible = false
        const target =
          binding.modifiers.fullscreen || binding.modifiers.body
            ? document.body
            : el
        removeClass(target, 'el-loading-parent--relative')
        removeClass(target, 'el-loading-parent--hidden')
      }
    })
    el.options = options
    el.instance = mask.proxy
    el.mask = mask.proxy.$el
    el.maskStyle = {}

    binding.value && toggleLoading(el, binding)
  },

  updated: function (el, binding) {
    el.instance.setText(el.getAttribute('element-loading-text'))
    if (binding.oldValue !== binding.value) {
      toggleLoading(el, binding)
    }
  },

  unmounted: function () {
    // if (el.domInserted) {
    //   el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
    //   toggleLoading(el, { value: false, modifiers: binding.modifiers })
    // }
    // el.instance && el.instance.close()
  }
}

export default {
  install(app) {
    // if (Vue.prototype.$isServer) return
    app.directive('loading', loadingDirective)
  }
}

export const directive = loadingDirective
