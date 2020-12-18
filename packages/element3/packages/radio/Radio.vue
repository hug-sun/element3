<template>
  <label
    role="radio"
    class="el-radio"
    :class="labelClass"
    :aria-disabled="isDisabled"
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
        @focus="focus = true"
        @blur="focus = false"
        @change="changeHandler"
      />
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { reactive, toRefs, computed, inject, getCurrentInstance } from 'vue'
import { propsConfig } from './useProps'

export default {
  name: 'ElRadio',
  componentName: 'ElRadio',
  props: propsConfig,
  emits: ['update:modelValue', 'update:value', 'change'],
  setup(props, context) {
    const {
      proxy,
      parent,
      parent: {
        proxy: { disabled: parentDisabled, radioGroupSize }
      }
    } = getCurrentInstance()
    const { elForm, elFormItem } = useInject()
    const state = reactive({
      isGroup: computed(() => parent.type.name === 'ElRadioGroup'),
      isDisabled: computed(
        () => props.disabled || parentDisabled || (elForm && elForm.disabled)
      ),
      radioSize: computed(
        () =>
          props.size ||
          radioGroupSize ||
          (elForm && elFormItem.elFormItemSize) ||
          (proxy.$ELEMENT || {}).size
      ),
      focus: false
    })
    const radioValue = computed({
      get: () => (state.isGroup ? parent.proxy.modelValue : props.modelValue),
      set: (value) => {
        if (state.isDisabled) return
        context.emit('update:modelValue', value)
        state.isGroup && parent.emit('update:modelValue', value)
      }
    })
    const labelClass = computed(() => [
      props.border && state.radioSize ? `el-radio--${state.radioSize}` : '',
      { 'is-checked': state.radioValue === props.label },
      { 'is-disabled': state.isDisabled },
      { 'is-focus': state.focus },
      { 'is-bordered': props.border }
    ])
    const changeHandler = () => {
      if (state.isDisabled) return
      context.emit('change', radioValue.value)
      state.isGroup && parent.emit('change', radioValue.value)
    }
    return {
      ...toRefs(state),
      labelClass,
      radioValue,
      changeHandler
    }
  }
}
const useInject = () => {
  const elForm = inject('elForm', {})
  const elFormItem = inject('elFormItem', {})
  return { elForm, elFormItem }
}
</script>

<style></style>
