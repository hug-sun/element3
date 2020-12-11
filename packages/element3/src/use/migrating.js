import { isOn } from '@vue/shared'
import { onMounted, getCurrentInstance } from 'vue'

export function migrating(options) {
  onMounted(() => {
    const componentInstance = getCurrentInstance()
    const componentName = componentInstance.type.name || ''
    const attrs = componentInstance.proxy.$attrs

    for (const key in options) {
      if (attrs[key]) {
        const warn = options[key]
        const type = isOn(key) ? 'Event' : 'Attribute'
        console.warn(`[Element Migrating][${componentName}][${type}]: ${warn}`)
      }
    }
  })
}
