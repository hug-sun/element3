<template>
  <button
    class="el-button"
    :class="classes"
    :type="nativeType"
    :disabled="buttonDisabled || loading"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-else-if="icon"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { props } from './props'
import { useGlobalOptions } from '../../../composables/globalConfig'
import { toRefs, inject, computed, defineComponent, Ref } from 'vue'
export default defineComponent({
  name: 'ElButton',
  props,
  setup(props) {
    const { size, disabled } = toRefs(props)
    const buttonSize = useButtonSize(size)
    const buttonDisabled = useButtonDisabled(disabled)
    const classes = useClasses({
      props,
      size: buttonSize,
      disabled: buttonDisabled
    })
    return {
      buttonDisabled,
      classes
    }
  }
})

const useClasses = ({ props, size, disabled }) => {
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

const useButtonDisabled = (disabled: Ref) => {
  return computed(() => {
    const elForm = inject('elForm', null)

    return disabled?.value || elForm?.disabled
  })
}

const useButtonSize = (size: Ref) => {
  const globalConfig = useGlobalOptions()
  return computed(() => {
    const elFormItem = inject('elFormItem', null)
    return size?.value || elFormItem?.elFormItemSize || globalConfig.size
  })
}
</script>
