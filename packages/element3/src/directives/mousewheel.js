import normalizeWheel from 'normalize-wheel'
import { isFirefox } from '../utils/util'

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

const mousewheel = function (element, callback) {
  if (element && element.addEventListener) {
    element.addEventListener(
      mousewheelEventName,
      function (event) {
        const normalized = normalizeWheel(event)
        callback && callback(event, normalized)
      },
      { passive: true }
    )
  }
}

export default {
  beforeMount(el, binding) {
    mousewheel(el, binding.value)
  }
}
