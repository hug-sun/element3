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
