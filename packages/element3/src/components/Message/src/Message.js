import messageComponent from './Message.vue'
import { createPopupComponent } from '../../../composables/component'
import { isVNode, render } from 'vue'

const instanceRefs = []
const target = 'body'
export function Message(opts) {
  return createMessage(mergeOptions(opts))
}

Message.closeAll = () => {
  instanceRefs.forEach((instance) => {
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

  addInstance(instance)
  return instance.proxy
}

function createMessageComponentByOpts(opts) {
  if (isVNode(opts.message)) {
    render(opts.message, document.createElement('div'))

    return createPopupComponent(messageComponent, opts, () => opts.message)
  }
  return createPopupComponent(messageComponent, opts)
}

function mergeOptions(opts, type = 'info') {
  const defaultOptions = {
    target,
    duration: 1500,
    type,
    offset: calculateVerticalOffset(opts.offset)
  }

  const userOnClose = opts?.onClose
  // opts.onClose Cannot be merged into the default options
  delete opts?.onClose
  delete opts?.offset
  defaultOptions.onCloseHook = (instance) => {
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
  instanceRefs.forEach((instance) => {
    result += getNextRefInterval(instance)
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
    index < instanceRefs.length;
    index++
  ) {
    const instance = instanceRefs[index]
    const offsetTop =
      instance.$el.offsetHeight - getNextElementInterval(closeInstance)

    instance.$el.style.top = offsetTop + 'px'
  }
}

function getNextRefInterval(instance) {
  const INTERVAL_HEIGHT = 16
  const target = instance.$el
  return target.offsetHeight + INTERVAL_HEIGHT
}

function getNextElementInterval(instance) {
  const INTERVAL_HEIGHT = 16
  const target = instance.proxy.$el

  return target.offsetHeight + INTERVAL_HEIGHT
}

function addInstance(instance) {
  instanceRefs.push(instance)
}

function removeInstance(instance) {
  instanceRefs.splice(getIndexByInstance(instance), 1)
}

function getIndexByInstance(instance) {
  return instanceRefs.findIndex((i) => i.$el == instance.proxy.$el)
}
