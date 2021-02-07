import messageComponent from './Message.vue'
import { createComponent } from '../../../composables/component'
import { PopupManager } from '../../../utils/popup'
import { isVNode } from 'vue'

const instanceList = []

export function Message(opts) {
  return createMessage(mergeOptions(opts))
}

Message.closeAll = () => {
  instanceList.forEach((instance) => {
    instance.proxy.close()
    removeInstance(instance)
  })
}
;['info', 'success', 'warning', 'error'].forEach((type) => {
  Message[type] = (opts) => {
    return createMessage(mergeOptions(opts, type))
  }
})

function createMessage(opts) {
  const instance = createMessageComponentByOpts(opts)
  setZIndex(instance)
  appendToBody(instance)
  addInstance(instance)
  return instance.proxy
}

function createMessageComponentByOpts(opts) {
  if (isVNode(opts.message)) {
    return createComponent(messageComponent, opts, () => opts.message)
  }
  return createComponent(messageComponent, opts)
}

function setZIndex(instance) {
  instance.vnode.el.style.zIndex = PopupManager.nextZIndex()
}

function mergeOptions(opts, type = 'info') {
  const defaultOptions = {
    duration: 4500,
    type,
    offset: calculateVerticalOffset(opts.offset)
  }

  const userOnClose = opts?.onClose
  // opts.onClose Cannot be merged into the default options
  delete opts?.onClose
  delete opts?.offset
  defaultOptions.onClose = (instance) => {
    closeMessage(instance)
    if (userOnClose) userOnClose(instance.proxy)
  }

  if (typeof opts === 'string' || isVNode(opts)) {
    defaultOptions.message = opts
    return defaultOptions
  }

  return Object.assign({}, defaultOptions, opts)
}

function calculateVerticalOffset(offset = 20) {
  let result = offset

  instanceList.forEach((instance) => {
    result += getNextElementInterval(instance)
  })

  return result
}

function closeMessage(instance) {
  updatePosition(instance)
  removeInstance(instance)
}

function updatePosition(closeInstance) {
  const currentInstanceIndex = getIndexByInstance(closeInstance)

  if (currentInstanceIndex < 0) return

  for (
    let index = currentInstanceIndex + 1;
    index < instanceList.length;
    index++
  ) {
    const instance = instanceList[index]
    instance.proxy.offsetVal -= getNextElementInterval(closeInstance)
  }
}

function getNextElementInterval(instance) {
  const INTERVAL_HEIGHT = 16
  return instance.vnode.el.offsetHeight + INTERVAL_HEIGHT
}

function addInstance(instance) {
  instanceList.push(instance)
}

function removeInstance(instance) {
  instanceList.splice(getIndexByInstance(instance), 1)
}

function getIndexByInstance(instance) {
  return instanceList.findIndex((i) => i.uid == instance.uid)
}

function appendToBody(componentInstance) {
  document.body.append(componentInstance.vnode.el)
}
