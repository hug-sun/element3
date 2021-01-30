// #todo
import { defineComponent, isVNode } from 'vue'
import { createComponent } from '../../../src/composables/component'
import msgboxVue from './MessageBox.vue'
import merge from '../../../src/utils/merge'
const messageBoxConstructor = defineComponent(msgboxVue)
const defaults = {
  title: null,
  message: '',
  type: '',
  iconClass: '',
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  inputValue: null,
  inputPlaceholder: '',
  inputType: 'text',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: '',
  cancelButtonText: '',
  confirmButtonClass: '',
  cancelButtonClass: '',
  customClass: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  center: false,
  roundButton: false,
  distinguishCancelAndClose: false
}

// const MessageBoxConstructor = {
//   extends: msgboxVue
// }

let currentMsg, instance
let msgQueue = []

const defaultCallback = (action) => {
  if (currentMsg) {
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.vnode.props.showInput) {
          currentMsg.resolve({
            value: instance.setupState.state.inputValue,
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
  instance = createComponent(messageBoxConstructor, currentMsg.options, VNode)
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
    if (isVNode(currentMsg.message)) {
      initInstance(currentMsg, { default: () => currentMsg.message })
    }
    initInstance(currentMsg)
    ;[
      'modal',
      'showClose',
      'closeOnClickModal',
      'closeOnPressEscape',
      'closeOnHashChange'
    ].forEach((prop) => {
      if (options[prop] === undefined) {
        options[prop] = true
      }
    })
    document.body.appendChild(instance.vnode.el)
  }
  // }
}

export const MessageBox = function (options, callback) {
  // if (Vue.prototype.$isServer) return
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options
    }
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      })

      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults, options),
      callback: callback
    })

    showNextMsg()
  }
}

MessageBox.setDefaults = (defaults) => {
  MessageBox.defaults = defaults
}

MessageBox.alert = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }
  return MessageBox(
    merge(
      {
        title: title,
        message: message,
        _type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false
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
    merge(
      {
        title: title,
        message: message,
        _type: 'confirm',
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
  return MessageBox(
    merge(
      {
        title: title,
        message: message,
        showCancelButton: true,
        showInput: true,
        _type: 'prompt'
      },
      options
    )
  )
}

MessageBox.close = () => {
  instance.doClose()
  msgQueue = []
  currentMsg = null
}
