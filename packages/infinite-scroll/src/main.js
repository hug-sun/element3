import { throttle } from 'throttle-debounce'
import { isHtmlElement, isFunction, isDefined } from '../../../src/utils/types'
import { getScrollContainer } from '../../../src/utils/dom'

const getStyleComputedProperty = (element, property) => {
  if (element === window) {
    element = document.documentElement
  }

  if (element.nodeType !== 1) {
    return []
  }
  // NOTE: 1 DOM access here
  const css = window.getComputedStyle(element, null)
  return property ? css[property] : css
}

const entries = (obj) => {
  return Object.keys(obj || {}).map((key) => [key, obj[key]])
}

const getPositionSize = (el, prop) => {
  return el === window || el === document
    ? document.documentElement[prop]
    : el[prop]
}

const getOffsetHeight = (el) => {
  return getPositionSize(el, 'offsetHeight')
}

const getClientHeight = (el) => {
  return getPositionSize(el, 'clientHeight')
}

const scope = 'ElInfiniteScroll'
const attributes = {
  delay: {
    type: Number,
    default: 200
  },
  distance: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  }
}

const getScrollOptions = (el) => {
  if (!isHtmlElement(el)) return {}

  return entries(attributes).reduce((map, [key, option]) => {
    const { type, default: defaultValue } = option
    const attributeName = `infinite-scroll-${key}`

    let value = el.hasAttribute(attributeName)
      ? el.getAttribute(attributeName)
      : defaultValue

    switch (type) {
      case Number:
        value = Number(value)
        value = Number.isNaN(value) ? defaultValue : value
        break
      case Boolean:
        value = isDefined(value)
          ? value === 'false'
            ? false
            : Boolean(value)
          : defaultValue
        break
      default:
        value = type(value)
    }
    map[key] = value
    return map
  }, {})
}

const getElementTop = (el) => el.getBoundingClientRect().top

const handleScroll = function (cb) {
  const { el, container, observer } = this[scope]
  const { distance, disabled } = getScrollOptions(el)

  if (disabled) return

  const containerInfo = container.getBoundingClientRect()
  if (!containerInfo.width && !containerInfo.height) return

  let shouldTrigger = false

  if (container === el) {
    // be aware of difference between clientHeight & offsetHeight & window.getComputedStyle().height
    const scrollBottom = container.scrollTop + getClientHeight(container)
    shouldTrigger = container.scrollHeight - scrollBottom <= distance
  } else {
    const heightBelowTop =
      getOffsetHeight(el) + getElementTop(el) - getElementTop(container)
    const offsetHeight = getOffsetHeight(container)
    const borderBottom = Number.parseFloat(
      getStyleComputedProperty(container, 'borderBottomWidth')
    )
    shouldTrigger = heightBelowTop - offsetHeight + borderBottom <= distance
  }

  if (shouldTrigger && isFunction(cb)) {
    cb.call()
  } else if (observer) {
    observer.disconnect()
    this[scope].observer = null
  }
}

export default {
  name: 'InfiniteScroll',

  mounted(el, binding) {
    const cb = binding.value

    // only include vertical scroll
    const container = getScrollContainer(el, true)
    const { delay, immediate } = getScrollOptions(el)
    const onScroll = throttle(delay, handleScroll.bind(el, cb))

    el[scope] = { el, container, onScroll }

    if (container) {
      container.addEventListener('scroll', onScroll)

      if (immediate) {
        const observer = (el[scope].observer = new MutationObserver(onScroll))
        observer.observe(container, { childList: true, subtree: true })
        onScroll()
      }
    }
  },

  unmounted(el) {
    const { container, onScroll } = el[scope]
    if (container) {
      container.removeEventListener('scroll', onScroll)
    }
  }
}
