<template>
  <label
    class="el-radio-button"
    :class="classes"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="el-radio-button__orig-radio"
      type="radio"
      @change="handleChange"
      :value="label"
      :name="name"
      v-model="value"
      :disabled="isDisabled"
      @focus="focus = true"
      @blur="focus = false"
      tabindex="-1"
    />
    <span
      class="el-radio-button__inner"
      :style="isChecked ? style : null"
      @keydown.stop
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script>
import { toRefs, ref, inject, computed, watch, getCurrentInstance } from 'vue'
import { props } from './props'
import { useGlobalOptions } from '../../../composables/globalConfig'

export default {
  name: 'ElRadioButton',

  componentName: 'ElRadioButton',

  props,

  setup(props) {
    const { radioGroup } = useCheckGroup()
    const { label, disabled } = toRefs(props)
    const focus = ref(false)

    let value = useModel(radioGroup)
    const handleChange = useChange(radioGroup, value)
    const { style, size, isDisabled } = useStyle({ disabled, radioGroup })
    const { classes, isChecked, tabIndex } = useClasses({
      size,
      isDisabled,
      value,
      label,
      focus,
      radioGroup
    })

    return {
      value,
      handleChange,
      isDisabled,
      tabIndex,
      classes,
      isChecked,
      style
    }
  }
}

const useCheckGroup = () => {
  const { parent } = getCurrentInstance()
  const isGroup = parent.type.name === 'ElRadioGroup'
  const radioGroup = isGroup ? parent : null
  return { isGroup, radioGroup }
}

const useModel = (radioGroup) => {
  const value = ref(radioGroup?.props.modelValue)

  watch(
    () => radioGroup?.props.modelValue,
    (val) => {
      value.value = val
    }
  )

  return value
}

const useChange = (radioGroup, value) => {
  const handleChange = () => {
    radioGroup?.emit('update:modelValue', value.value)
    radioGroup?.emit('change', value.value)
  }

  return handleChange
}

const useStyle = ({ disabled, radioGroup }) => {
  const globalConfig = useGlobalOptions()

  const isDisabled = computed(() => {
    const elForm = inject('elForm', {})

    return disabled?.value || radioGroup?.props.disabled || elForm.disabled
  })

  const size = computed(() => {
    const elFormItem = inject('elFormItem', {})

    return (
      radioGroup?.props.size || elFormItem?.elFormItemSize || globalConfig.size
    )
  })

  const style = computed(() => {
    return {
      backgroundColor: radioGroup?.props.fill || '',
      borderColor: radioGroup?.props.fill || '',
      boxShadow: radioGroup?.props.fill
        ? `-1px 0 0 0 ${radioGroup?.props.fill}`
        : '',
      color: radioGroup?.props.textColor || ''
    }
  })

  return {
    isDisabled,
    size,
    style
  }
}

const useClasses = ({ size, isDisabled, focus, value, label, radioGroup }) => {
  const isChecked = computed(() => {
    return value.value === label.value
  })

  const tabIndex = computed(() => {
    return isDisabled.value || (radioGroup && value.value !== label.value)
      ? -1
      : 0
  })

  const classes = computed(() => {
    return [
      size.value ? 'el-radio-button--' + size.value : '',
      { 'is-active': isChecked.value },
      { 'is-disabled': isDisabled.value },
      { 'is-focus': focus.value }
    ]
  })

  return {
    isChecked,
    classes,
    tabIndex
  }
}
</script>
