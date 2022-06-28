<script lang="ts" setup>
import { computed, inject, toRefs, withDefaults } from 'vue'
import type { Ref } from 'vue'
// 按钮类型
type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
type ButtonSize = 'medium' | 'small' | 'mini'
type ButtonNativeType = 'button' | 'submit' | 'reset'

interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  round?: boolean
  plain?: boolean
  nativeType?: ButtonNativeType
  circle?: boolean
  icon?: string
  loading?: boolean
  disabled?: boolean
}

// withDefaults 使用类型声明时的默认 props 值
const props = withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

const { size, disabled } = toRefs(props)

const useButtonSize = (size: Ref) => {
  return computed(() => {
    const elForm = inject('elForm', null)
    return size?.value || elForm?.size
  })
}
function useClasses({ props, size }) {
  return computed(() => {
    return [
      props.type ? `el-button--${props.type}` : '',
      size.value ? `el-button--${size.value}` : '',
      {
        'is-round': props.round,
        'is-plain': props.plain,
        'is-circle': props.circle,
        'is-disabled': props.disabled,
      },
    ]
  })
}

const buttonSize = useButtonSize(size)
const classes = useClasses({
  props,
  size: buttonSize,
})
</script>

<template>
  <!-- props size  medium / small / mini -->
  <button
    class="el-button"
    :class="classes"
    :type="nativeType"
    :disabled="disabled || loading"
  >
    <i v-if="loading" class="el-icon-loading" data-testid="loadingIcon" />
    <i v-else-if="icon" :class="icon" data-testid="icon" />
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
@import "../../theme/src/button.scss";
</style>
