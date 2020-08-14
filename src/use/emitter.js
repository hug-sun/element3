import { getCurrentInstance } from 'vue'

export function useEmitter() {
  return {
    dispatch: dispatch(),
    broadcast: broadcast()
  }
}

function dispatch() {
  const instance = getCurrentInstance()

  return (componentName, eventName, params) => {
    let parent = instance.parent
    while (parent && parent.type.name !== componentName) {
      parent = parent.parent
    }

    if (parent) {
      parent.emit(eventName, ...params)
    }
  }
}

function broadcast() {
  const instance = getCurrentInstance()

  return (componentName, eventName, params) => {
    const _broadcast = (componentInstance) => {
      if (!componentInstance) return

      const children = componentInstance.subTree.children
      if (children) {
        children.forEach((vnode) => {
          const childComponent = vnode.component
          if (childComponent.type.name === componentName) {
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
