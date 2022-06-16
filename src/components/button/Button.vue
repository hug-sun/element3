<template>
  <button
    class="el-button"
    :class="classes"
    :type="nativeType"
    :disabled="disabled || loading"
  >
    <i class="el-icon-loading" v-if="loading" data-testid="loadingIcon"></i>
    <i :class="icon" v-else-if="icon" data-testid="icon"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'ElButton'
})
</script>
<script setup lang="ts">
// import { props } from './props'
import { useGlobalOptions } from '../../hooks/globalConfig'
import { toRefs, inject, computed, withDefaults } from 'vue'
import type { Ref, ComputedRef } from 'vue'

type ButtonType = 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text'

type ButtonSize = 'large' | 'medium' | 'small' | 'mini'

type ButtonNativeType = 'button' | 'submit' | 'reset' | 'menu'

interface ButtonProps{
  size?:ButtonSize
  type?:ButtonType
  nativeType?:ButtonNativeType
  plain?:boolean
  round?:boolean
  circle?:boolean
  loading?:boolean
  disabled?:boolean
  icon?:string
}

const props = withDefaults(defineProps<ButtonProps>(),{
  nativeType:'button'
})

const useButtonSize = function(size: Ref<ButtonSize>):ComputedRef<ButtonSize>{
  const globalConfig = useGlobalOptions()
  return computed(() => {
    // const elFormItem = inject('elFormItem', null)
    // || elFormItem?.elFormItemSize
    return size?.value || globalConfig.size
  })
}


const useClasses = function({ props, size, disabled }){
  return computed(() => {
    return [
      size.value ? `el-button--${size.value}` : '',
      props.type ? `el-button--${props.type}` : '',
      {
        'is-plain': props.plain,
        'is-round': props.round,
        'is-circle': props.circle,
        'is-loading': props.loading,
        'is-disabled': disabled.value
      }
    ]
  })
}

const { size, disabled } = toRefs(props)
const buttonSize = useButtonSize(size)
// const buttonDisabled = useButtonDisabled(disabled)
const classes = useClasses({
  props,
  disabled,
  size:buttonSize
})

// const useButtonDisabled = (disabled: Ref) => {
//   return computed(() => {
//     const elForm = inject('elForm', null)

//     return disabled?.value || elForm?.disabled
//   })
// }


</script>
<style lang="scss">
@import '../../theme/src/button.scss'
</style>>

