/**
 * Checkbox and CheckboxButton are connected logically
 */

import { useGlobalOptions } from '../../src/use/globalConfig'
import { computed, inject, unref } from 'vue'

export const useSize = (size) => {
  const globalConfig = useGlobalOptions()
  const { elCheckboxGroup, elFormItem } = useInject()
  const checkboxSize = computed(() => {
    return (
      size?.value ||
      elCheckboxGroup.proxy.size ||
      elFormItem.size ||
      globalConfig.size
    )
  })

  return {
    checkboxSize
  }
}

export const useDisabled = (disabled, isChecked) => {
  const { elCheckboxGroup, elFormItem } = useInject()
  const modelValue = computed(() => elCheckboxGroup.proxy.modelValue)
  const min = computed(() => elCheckboxGroup.proxy.min)
  const max = computed(() => elCheckboxGroup.proxy.max)
  const disabledValue = computed(() => {
    return (
      disabled?.value ||
      unref(elCheckboxGroup.proxy.disabled) ||
      unref(elFormItem.disabled) ||
      false
    )
  })

  const isDisabled = computed(() => {
    let limit = false
    if (modelValue.value) {
      limit =
        (modelValue.value.length <= min.value && isChecked.value) ||
        (modelValue.value.length >= max.value && !isChecked.value)
    }

    return disabledValue.value || limit
  })

  return {
    isDisabled
  }
}

function useInject() {
  const elCheckboxGroup = inject('elCheckboxGroup', { proxy: {} })
  const elFormItem = inject('elFormItem', {})

  return {
    elCheckboxGroup,
    elFormItem
  }
}
