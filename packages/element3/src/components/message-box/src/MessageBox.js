import { isVNode } from 'vue'
import { createComponent } from '../../../use/component'
import msgboxVue from './MessageBox.vue'

let currentMsg, instance
let msgQueue = []

const defaultCallback = (action) => {
  if (currentMsg) {
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.proxy.showInput) {
          currentMsg.resolve({
            value: instance.proxy.inputValue,
            action
          })
        } else {
          currentMsg.resolve({ action })
        }
      } else if (
        currentMsg.reject &&
        (action === 'cancel' || action === 'close')
      ) {
        currentMsg.reject({ action })
      }
    }
  }
}

const initInstance = (currentMsg, VNode = null) => {
  instance = createComponent(msgboxVue, currentMsg.options, VNode)
  MessageBox.instance = instance
}

const showNextMsg = () => {
  if (msgQueue.length > 0) {
    currentMsg = msgQueue.shift()
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
  let promiseInstance = new Promise((resolve, reject) => {
    // eslint-disable-line
    msgQueue.push({
      options: options,
      callback: callback,
      resolve: resolve,
      reject: reject
    })
    showNextMsg()
  })
  promiseInstance.instance = instance
  return promiseInstance
}

const MergeCondition = (message, title, options) => {
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
  return Object.assign(
    {
      title: title,
      message: message,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    },
    options
  )
}

MessageBox.alert = (message, title, options) => {
  const defaultVal = {
    type: null,
    category: 'alert',
    closeOnPressEscape: false
  }
  return MessageBox(
    Object.assign(defaultVal, MergeCondition(message, title, options))
  )
}

MessageBox.confirm = (message, title, options) => {
  const defaultVal = {
    type: 'info',
    category: 'confirm'
  }
  return MessageBox(
    Object.assign(defaultVal, MergeCondition(message, title, options))
  )
}

MessageBox.prompt = (message, title, options) => {
  const defaultVal = {
    type: null,
    showInput: true,
    category: 'prompt',
    inputErrorMessage: '输入的数据不合法!'
  }
  return MessageBox(
    Object.assign(defaultVal, MergeCondition(message, title, options))
  )
}

MessageBox.close = () => {
  instance.proxy.closeHandle()
  msgQueue = []
  currentMsg = null
}

export default MessageBox
export { MessageBox }
