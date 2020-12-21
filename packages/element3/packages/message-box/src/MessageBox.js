// #todo
import { isVNode } from 'vue'
import { createComponent } from '../../../src/use/component'
import msgboxVue from './MessageBox.vue'
import propsList from './prop/prop'
const defaults = propsList

let currentMsg, instance
let msgQueue = []

const defaultCallback = (action) => {
  if (currentMsg) {
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.proxy.showInput) {
          currentMsg.resolve({
            value: instance.proxy.modelValue,
            action
          })
        } else {
          currentMsg.resolve(action)
        }
      } else if (
        currentMsg.reject &&
        (action === 'cancel' || action === 'close')
      ) {
        currentMsg.reject(action)
      }
    }
  }
}

const initInstance = (currentMsg, VNode = null) => {
  defaults.callback = defaultCallback
  instance = createComponent(msgboxVue, currentMsg.options, VNode)
}

const showNextMsg = () => {
  if (msgQueue.length > 0) {
    currentMsg = msgQueue.shift()
    // initInstance(currentMsg)
    const options = currentMsg.options

    if (options.callback === undefined) {
      options.callback = defaultCallback
    }

    const oldCb = options.callback
    options.callback = (action, instance) => {
      oldCb(action, instance)
    }

    initInstance(currentMsg, isVNode(options.message) ? options.message : null)
    document.body.appendChild(instance.vnode.el)
  }
}

const MessageBox = function (options) {
  let callback = null
  if (options.callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      // eslint-disable-line
      msgQueue.push({
        options: Object.assign({}, defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      })

      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: Object.assign({}, defaults, options),
      callback: callback
    })

    showNextMsg()
  }
}

MessageBox.alert = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }
  if (typeof message === 'object') {
    options = message
    message = ''
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        category: 'alert'
      },
      options
    )
  )
}

MessageBox.confirm = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        category: 'confirm',
        showCancelButton: true
      },
      options
    )
  )
}

MessageBox.prompt = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }
  if (typeof message === 'object') {
    options = message
  }
  return MessageBox(
    Object.assign(
      {
        title: title,
        message: message,
        showCancelButton: true,
        showInput: true,
        category: 'prompt'
      },
      options
    )
  )
}

MessageBox.close = () => {
  instance.proxy.closeHandle()
  msgQueue = []
  currentMsg = null
}

export default MessageBox
export { MessageBox }
