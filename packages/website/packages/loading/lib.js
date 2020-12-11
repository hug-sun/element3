import { PopupManager } from '../../src/utils/popup'
import { addClass, removeClass, getStyle } from '../../src/utils/dom'

export const addStyle = (options, parent, ctx) => {
  const maskStyle = {}
  if (options.fullscreen) {
    addClass(ctx.$el, 'is-fullscreen')
    ctx.originalPosition = getStyle(document.body, 'position')
    ctx.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    removeClass(ctx.$el, 'is-fullscreen')
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

  if (ctx.originalPosition !== 'absolute' && ctx.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative')
  }

  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden')
  }
}
