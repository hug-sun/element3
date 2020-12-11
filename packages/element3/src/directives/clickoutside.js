import { on } from '../utils/dom'

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

// !Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e))
on(document, 'mousedown', (e) => (startClick = e))

on(document, 'mouseup', (e) => {
  // !Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach((node) => node[ctx].documentHandler(e, startClick))
})

function createDocumentHandler(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !binding.instance ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (binding.instance.popperElm &&
        (binding.instance.popperElm.contains(mouseup.target) ||
          binding.instance.popperElm.contains(mousedown.target)))
    )
      return

    if (
      binding.expression &&
      el[ctx].methodName &&
      binding.instance[el[ctx].methodName]
    ) {
      binding.instance[el[ctx].methodName]()
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  beforeMount(el, binding, vnode) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },

  updated(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },

  unmounted(el) {
    const len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
