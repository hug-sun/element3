import { addClass, removeClass } from '../utils/dom'
import { h, Transition } from 'vue'

class TransitionFn {
  beforeEnter(el) {
    addClass(el, 'collapse-transition')
    !el.dataset && (el.dataset = {})

    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom

    el.style.height = '0'
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  }

  enter(el) {
    el.dataset.oldOverflow = el.style.overflow
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    } else {
      el.style.height = ''
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }

    el.style.overflow = 'hidden'
  }

  afterEnter(el) {
    // for safari: remove class then reset height is necessary
    removeClass(el, 'collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
  }

  beforeLeave(el) {
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.height = el.scrollHeight + 'px'
    el.style.overflow = 'hidden'
  }

  leave(el) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition')
      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
  }

  afterLeave(el) {
    removeClass(el, 'collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
    el.style.paddingTop = el.dataset.oldPaddingTop
    el.style.paddingBottom = el.dataset.oldPaddingBottom
  }
}

const ElCollapseTransition = (props, context) => {
  const transitions = new TransitionFn()
  const data = {
    onBeforeEnter: transitions.beforeEnter,
    onEnter: transitions.enter,
    onAfterEnter: transitions.afterEnter,
    onBeforeLeave: transitions.beforeLeave,
    onLeave: transitions.leave,
    onAfterLeave: transitions.afterLeave
  }
  return h(Transition, data, context.slots)
}

ElCollapseTransition.install = function (app) {
  app.component('ElCollapseTransition', ElCollapseTransition)
}

export default ElCollapseTransition
