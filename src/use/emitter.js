import { getCurrentInstance } from 'vue'
import { capitalize } from 'element-ui/src/utils/util'
const EVENT_NAME_KEY = Symbol('ELEMENT_EVENTS')

export function useEmitter(instance = getCurrentInstance()) {
  return {
    dispatch: dispatch(instance),
    broadcast: broadcast(instance),
    on: on(instance),
    once: once(instance),
    off: off(instance)
  }
}

function on(instance) {
  return (originalEventName, callback) => {
    const eventName = 'on' + capitalize(originalEventName)

    if (!instance.vnode.props) {
      instance.vnode.props = {}
    }

    if (!instance.vnode.props[EVENT_NAME_KEY]) {
      instance.vnode.props[EVENT_NAME_KEY] = new Set()
    }
    instance.vnode.props[EVENT_NAME_KEY].add(eventName)

    if (!instance.vnode.props[eventName]) {
      instance.vnode.props[eventName] = (...params) => {
        const callbacks = instance.vnode.props[eventName].__events
        if (callbacks) {
          callbacks.forEach((cf) => {
            cf(...params)
          })
        }
      }
      instance.vnode.props[eventName].__events = []
    }
    instance.vnode.props[eventName].__events.push(callback)
  }
}
function once(instance) {
  const $off = off(instance)
  const $on = on(instance)
  return (originalEventName, handle) => {
    const _on = (...params) => {
      $off(originalEventName, _on)
      handle(...params)
    }
    $on(originalEventName, _on)
  }
}

function off(instance) {
  return (originalEventName, callback) => {
    const eventNameList =
      instance.vnode.props && instance.vnode.props[EVENT_NAME_KEY]
    if (!eventNameList || !eventNameList.size) {
      return
    }

    if (!originalEventName) {
      eventNameList.forEach((eventName) => {
        delete instance.vnode.props[eventName]
      })
      eventNameList.clear()
      return
    }

    const eventName = 'on' + capitalize(originalEventName)

    if (!callback) {
      delete instance.vnode.props[eventName]
      eventNameList.delete(eventName)
      return
    }

    const handlers =
      instance.vnode.props[eventName] &&
      instance.vnode.props[eventName].__events
    if (handlers && handlers.length) {
      const index = handlers.indexOf(callback)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}

function dispatch(instance) {
  return (componentName, eventName, ...params) => {
    let parent = instance.parent
    while (parent && parent.type.name !== componentName) {
      parent = parent.parent
    }

    if (parent) {
      parent.emit(eventName, ...params)
    }
  }
}

function broadcast(instance) {
  return (componentName, eventName, ...params) => {
    const _broadcast = (componentInstance) => {
      if (!componentInstance) return

      const children = componentInstance.subTree.children
      if (children) {
        children.forEach((vnode) => {
          const childComponent = vnode.component

          if (childComponent?.type?.name === componentName) {
            childComponent.emit(eventName, ...params)
          } else {
            _broadcast(childComponent)
          }
        })
      }
    }

    _broadcast(instance)
  }
}
