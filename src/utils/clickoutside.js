import { on } from 'element-ui/src/utils/dom'

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

function createDocumentHandler(el) {
  return function (mouseup = {}, mousedown = {}) {
    if (
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target
    )
      return

    el[ctx].bindingFn &&
      typeof el[ctx].bindingFn === 'function' &&
      el[ctx].bindingFn()
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
  beforeMount(el, binding) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  updated(el, binding) {
    el[ctx].documentHandler = createDocumentHandler(el)
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
