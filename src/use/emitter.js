import { getCurrentInstance } from 'vue'

export function useDispatch(componentName, eventName, params) {
  if (!getCurrentInstance()) return

  let parent = getCurrentInstance().parent
  while (parent && parent.type.name !== componentName) {
    parent = parent.parent
  }

  if (parent) {
    parent.emit(eventName, ...params)
  }
}

export function useBroadcast(componentName, eventName, params) {
  const broadcast = (componentInstance) => {
    if (!componentInstance) return

    const children = componentInstance.subTree.children
    if (children) {
      children.forEach((vnode) => {

        if (vnode.component.type.name === componentName) {
          vnode.component.emit(eventName, ...params)
          return
        }

        broadcast(vnode.component)
      })
    }
  }

  broadcast(getCurrentInstance())
}
