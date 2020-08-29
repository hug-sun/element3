import { computed, inject, unref, getCurrentInstance, watch } from 'vue'
export const useSize = (size) => {
  const elFormItem = inject('elFormItem', {})

  const _elFormItemSize = computed(() => {
    return unref(elFormItem.elFormItemSize)
  })

  const inputNumberSize = computed(() => {
    return (
      size.value ||
      _elFormItemSize ||
      (getCurrentInstance().ctx.$ELEMENT || {}).size
    )
  })
  return inputNumberSize
}
