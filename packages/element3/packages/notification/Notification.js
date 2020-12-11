import { defineComponent, createVNode, render, isVNode } from 'vue'
import Main from './Notification.vue'
import merge from '../../src/utils/merge'
import { PopupManager } from '../../src/utils/popup'

const NotificationConstructor = defineComponent(Main)

let instance
const instances = []
let seed = 1

const Notification = function (options) {
  // check ssr
  if (window === undefined) return

  const userOnClose = options.onClose
  const id = 'notification_' + seed++
  const position = options.position || 'top-right'
  let verticalOffset = options.offset || 0
  instances
    .filter((instance) => instance.component.props.position === position)
    .forEach((instance) => {
      verticalOffset += (instance.el.offsetHeight || 0) + 16
    })
  verticalOffset += 16
  const nextZIndex = PopupManager.nextZIndex()
  options = merge(
    {
      id,
      position,
      verticalOffset,
      zIndex: nextZIndex,
      onClose() {
        Notification.close(id, userOnClose)
      }
    },
    options
  )
  instance = createVNode(
    NotificationConstructor,
    options,
    isVNode(options.message)
      ? {
          default: () => options.message
        }
      : null
  )

  // 防止render直接到body上导致覆盖原来的
  const container = document.createElement('div')

  render(instance, container)
  instance.el.style.zIndex = nextZIndex
  instances.push(instance)
  document.body.appendChild(instance.el)
  return {
    close() {
      Notification.close(id, userOnClose)
    }
  }
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

Notification.close = function (id, userOnClose) {
  const index = instances.findIndex((instance) => {
    return instance.component.props.id === id
  })
  if (index === -1) {
    return
  }

  const instance = instances[index]

  if (typeof userOnClose === 'function') {
    userOnClose(instance)
  }

  const len = instances.length
  instances.splice(index, 1)

  if (len <= 1) return

  const position = instance.component.props.position
  const removedHeight = instance.el.offsetHeight
  for (let i = index; i < len - 1; i++) {
    if (instances[i].component.props.position === position) {
      instances[i].el.style[
        instance.component.props.position.startsWith('top') ? 'top' : 'bottom'
      ] =
        parseInt(
          instances[i].el.style[
            instance.component.props.position.startsWith('top')
              ? 'top'
              : 'bottom'
          ],
          10
        ) -
        removedHeight -
        16 +
        'px'
    }
  }
}

Notification.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].component.ctx.close()
  }
}

export default Notification
