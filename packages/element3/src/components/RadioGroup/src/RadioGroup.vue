<template>
  <div class="el-radio-group" role="radiogroup">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { defineComponent, inject, computed, toRefs, watch } from 'vue'
import { useGlobalOptions } from '../../../composables/globalConfig'
import { useEmitter } from '../../../composables/emitter'

export default defineComponent({
  name: 'ElRadioGroup',

  props,

  emits: ['update:modelValue', 'change'],

  setup(props) {
    const { size, modelValue } = toRefs(props)
    const globalConfig = useGlobalOptions()
    const elFormItem = inject('elFormItem', {})
    const { dispatch } = useEmitter()

    watch(modelValue, (v) => {
      dispatch('el.form.change', v)
    })

    const radioGroupSize = useRadioGroupSize({ size, elFormItem, globalConfig })

    return {
      radioGroupSize
    }
  }
})

const useRadioGroupSize = ({ size, elFormItem, globalConfig }) => {
  return computed(() => {
    return (
      size?.value || (elFormItem as any)?.elFormItemSize || globalConfig.size
    )
  })
}
</script>
