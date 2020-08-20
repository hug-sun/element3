import { getCurrentInstance } from 'vue'

export function isAfferentProp(propKey) { // Used only for setuping or mounting
  const { vnode } = getCurrentInstance()
  if (Object.keys(vnode.props).indexOf(propKey) !== -1) {
    return true
  }
  return false
}
