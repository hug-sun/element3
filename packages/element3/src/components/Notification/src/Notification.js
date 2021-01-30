import { isVNode } from 'vue'
import notificationComponent from './Notification.vue'
import { createComponent } from '../../../../src/composables/component.js'
import { PopupManager } from '../../../../src/utils/popup'

const instanceList = []
const INTERVAL_HEIGHT = 16

export function Notification(options) {
  return createNotification(mergeProps(options))
}

function addInstance(instance) {
  instanceList.push(instance)
}

function createNotification(options) {
  const instance = createNotificationByOpts(options)
  setZIndex(instance)
  addInstance(instance)
  addToBody(instance)
  return instance.proxy
}

function createNotificationByOpts(opts) {
  if (isVNode(opts.message)) {
    return createComponent(notificationComponent, opts, () => opts.message)
  }

  return createComponent(notificationComponent, opts)
}

function setZIndex(instance) {
  instance.vnode.el.style.zIndex = PopupManager.nextZIndex()
}

function addToBody(instance) {
  document.body.append(instance.vnode.el)
}

function mergeProps(options) {
  const position = options.position || 'top-right'

  const verticalOffset = calculateVerticalOffset(position)

  const defaultOptions = {
    position,
    verticalOffset
  }
  const userOnClose = options?.onClose
  delete options?.onClose
  defaultOptions.onClose = (instance) => {
    closeNotification(instance)
    if (userOnClose) userOnClose(instance.proxy)
  }

  const userOnClick = options?.onClick
  delete options?.onClick
  defaultOptions.onClick = (instance) => {
    if (userOnClick) userOnClick(instance.proxy)
  }

  if (typeof options === 'string' || isVNode(options)) {
    defaultOptions.message = options
    return defaultOptions
  }
  return Object.assign({}, defaultOptions, options)
}

function calculateVerticalOffset(position, offset = 0) {
  let verticalOffset = offset

  instanceList
    .filter((instance) => instance.props.position === position)
    .forEach((instance) => {
      verticalOffset += (instance.vnode.el.offsetHeight || 0) + INTERVAL_HEIGHT
    })
  verticalOffset += INTERVAL_HEIGHT

  return verticalOffset
}

function closeNotification(instance) {
  updatePosition(instance)
}

function updatePosition(closeInstance) {
  const currentInstanceIndex = getIndexByInstance(closeInstance)
  if (currentInstanceIndex < 0) return

  const instance = instanceList[currentInstanceIndex]
  const len = instanceList.length
  removeInstance(instance)
  if (len <= 1) return
  const position = instance.props.position
  const removedHeight = instance.vnode.el.offsetHeight
  for (let i = currentInstanceIndex; i < len - 1; i++) {
    if (instanceList[i].props.position === position) {
      instanceList[i].vnode.el.style[
        instance.props.position.startsWith('top') ? 'top' : 'bottom'
      ] =
        parseInt(
          instanceList[i].vnode.el.style[
            instance.props.position.startsWith('top') ? 'top' : 'bottom'
          ],
          10
        ) -
        removedHeight -
        INTERVAL_HEIGHT +
        'px'
    }
  }
}

function removeInstance(instance) {
  instanceList.splice(getIndexByInstance(instance), 1)
}

function getIndexByInstance(instance) {
  return instanceList.findIndex((i) => i.uid == instance.uid)
}

;['success', 'warning', 'info', 'error'].forEach((type) => {
  Notification[type] = (options) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options
      }
    }
    options.type = type
    return Notification(options)
  }
})

Notification.closeAll = () => {
  instanceList.forEach((instance) => {
    instance.proxy.close()
    removeInstance(instance)
  })
}
