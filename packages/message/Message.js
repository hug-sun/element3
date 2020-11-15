import { defineComponent, createVNode, render, isVNode } from 'vue'
import Main from './Message.vue'
import { PopupManager } from '../../src/utils/popup'
import merge from '../../src/utils/merge'

const MessageConstructor = defineComponent(Main)

let instance
const instances = []
let seed = 1

const Message = function (options) {
  // if (Vue.prototype.$isServer) return
  // check ssr
  if (window === undefined) return

  options = options || {}
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options
    }
  }
  const userOnClose = options.onClose
  const id = 'message_' + seed++

  options.onClose = function () {
    Message.close(id, userOnClose)
  }
  let verticalOffset = options.offset || 20
  instances.forEach((item) => {
    verticalOffset += item.el.offsetHeight + 16
  })

  const nextZIndex = PopupManager.nextZIndex()
  options = merge(
    {
      id,
      verticalOffset,
      zIndex: nextZIndex
    },
    options
  )
  instance = createVNode(
    MessageConstructor,
    options,
    isVNode(options.message)
      ? {
          default: () => options.message
        }
      : null
  )

  const container = document.createElement('div')
  render(instance, container)
  instance.el.style.zIndex = nextZIndex
  document.body.appendChild(instance.el)
  instances.push(instance)
  return instance
}

;['success', 'warning', 'info', 'error'].forEach((type) => {
  Message[type] = (options) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

Message.close = function (id, userOnClose) {
  const len = instances.length
  let index = -1
  let removedHeight
  for (let i = 0; i < len; i++) {
    if (id === instances[i].component.props.id) {
      removedHeight = instances[i].el.offsetHeight
      index = i
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  for (let i = index; i < len - 1; i++) {
    const dom = instances[i].el
    dom.style.top = parseInt(dom.style.top, 10) - removedHeight - 16 + 'px'
  }
}

Message.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].component.ctx.close()
  }
}

export default Message
