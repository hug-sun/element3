import { getCurrentInstance } from 'vue'

export function useCheckGroup(type) {
  let { parent } = getCurrentInstance()
  while (parent) {
    if (parent.type.name !== 'ElRadioGroup') {
      parent = parent.parent
    } else {
      return {
        isGroup: true,
        radioGroup: parent
      }
    }
  }
  if (type === 'button') {
    console.warn(
      'ElementUI Warn: `<radio-button></radio-button>` must be use with <radio-group></radio-group>'
    )
  }
  return {
    isGroup: false,
    radioGroup: null
  }
}
