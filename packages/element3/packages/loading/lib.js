import { PopupManager } from '../../src/utils/popup'
import { addClass, removeClass, getStyle } from '../../src/utils/dom'

export const addStyle = (options, parent, proxy) => {
  const maskStyle = {}
  if (options.fullscreen) {
    addClass(proxy.$el, 'is-fullscreen')
    proxy.originalPosition = getStyle(document.body, 'position')
    proxy.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    removeClass(proxy.$el, 'is-fullscreen')
    proxy.originalPosition = getStyle(document.body, 'position')
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
    proxy.originalPosition = getStyle(parent, 'position')
  }
  Object.keys(maskStyle).forEach((property) => {
    proxy.$el.style[property] = maskStyle[property]
  })

  if (
    proxy.originalPosition !== 'absolute' &&
    proxy.originalPosition !== 'fixed'
  ) {
    addClass(parent, 'el-loading-parent--relative')
  }

  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden')
  }
}
