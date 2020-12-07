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

<script>
import { useGlobalOptions } from '../../src/use/globalConfig'
import { toRefs, inject, computed } from 'vue'
export default {
  name: 'ElButton',
  props: {
    size: {
      type: String,
      validator(val) {
        if (val === '') return true
        return ['medium', 'small', 'mini'].indexOf(val) !== -1
      }
    },
    type: {
      type: String,
      validator(val) {
        return (
          ['primary', 'success', 'warning', 'danger', 'info', 'text'].indexOf(
            val
          ) !== -1
        )
      }
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    loading: Boolean,
    disabled: Boolean,
    icon: String
  },
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
}

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

const useButtonDisabled = (disabled) => {
  return computed(() => {
    const elForm = inject('elForm', {})

    return disabled?.value || elForm.disabled
  })
}

const useButtonSize = (size) => {
  const globalConfig = useGlobalOptions()
  return computed(() => {
    const elFormItem = inject('elFormItem', {})
    return size?.value || elFormItem.elFormItemSize || globalConfig.size
  })
}
</script>
