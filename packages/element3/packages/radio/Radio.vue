<template>
  <label
    role="radio"
    class="el-radio"
    :class="labelClass"
    :aria-checked="radioValue === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
  >
    <span
      class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': radioValue === label
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        type="radio"
        class="el-radio__original"
        :value="label"
        v-model="radioValue"
        :name="name"
        aria-hidden="true"
        :disabled="isDisabled"
        @focus="focus = true"
        @blur="focus = false"
        tabindex="-1"
      />
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { ref, computed, inject, getCurrentInstance, defineComponent } from 'vue'
import { props } from './props'

export default defineComponent({
  name: 'ElRadio',
  componentName: 'ElRadio',
  props,
  emits: ['update:modelValue', 'update:value', 'change'],
  setup(props, context) {
    const focus = ref(false)
    const { elForm, elFormItem } = useInject()
    const { isGroup, radioGroup } = useCheckGroup()
    const radioValue = computed({
      get: () => (isGroup ? radioGroup.proxy.modelValue : props.modelValue),
      set: (value) => {
        changeHandler(value)
      }
    })
    const { isDisabled, radioSize, tabIndex } = useStyle({
      props,
      isGroup,
      radioGroup,
      elForm,
      elFormItem,
      radioValue
    })

    const labelClass = useLabelClass({
      props,
      radioSize,
      radioValue,
      isDisabled,
      focus
    })
    const changeHandler = (value) => {
      context.emit('update:modelValue', value)
      isGroup && radioGroup.emit('update:modelValue', value)
      context.emit('change', value)
      isGroup && radioGroup.emit('change', value)
    }
    return {
      focus,
      radioValue,
      isDisabled,
      radioSize,
      tabIndex,
      labelClass,
      changeHandler
    }
  }
})
const useInject = () => {
  const elForm = inject('elForm', {})
  const elFormItem = inject('elFormItem', {})
  return { elForm, elFormItem }
}
const useCheckGroup = () => {
  const { parent } = getCurrentInstance()
  const isGroup = parent.type.name === 'ElRadioGroup'
  const radioGroup = isGroup ? parent : null
  return { isGroup, radioGroup }
}
const useStyle = ({
  props,
  isGroup,
  radioGroup,
  elForm,
  elFormItem,
  radioValue
}) => {
  const {
    proxy,
    parent: {
      proxy: { radioGroupSize }
    }
  } = getCurrentInstance()
  const elFormDisable = elForm.disabled
  const isDisabled = computed(() =>
    isGroup
      ? radioGroup.props.disabled || props.disabled || elFormDisable
      : props.disabled || elFormDisable
  )

  const radioSize = computed(
    () =>
      props.size ||
      radioGroupSize ||
      (elForm && elFormItem.elFormItemSize) ||
      (proxy.$ELEMENT || {}).size
  )
  const tabIndex = computed(() =>
    isDisabled.value || (isGroup && radioValue.value !== props.label) ? -1 : 0
  )

  return { isDisabled, radioSize, tabIndex }
}
const useLabelClass = ({ props, radioSize, radioValue, isDisabled, focus }) =>
  computed(() => [
    props.border && radioSize.value ? `el-radio--${radioSize.value}` : '',
    { 'is-checked': radioValue.value === props.label },
    { 'is-disabled': isDisabled.value },
    { 'is-focus': focus.value },
    { 'is-bordered': props.border }
  ])
</script>

<style></style>
