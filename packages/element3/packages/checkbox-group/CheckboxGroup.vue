<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { useEmitter } from '../../src/composables/emitter'
import { provide, getCurrentInstance, computed, inject } from 'vue'
export default {
  name: 'ElCheckboxGroup',

  props: {
    modelValue: Array,
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String,
    border: Boolean
  },

  emits: ['update:modelValue', 'change'],

  setup(props, { emit }) {
    const elForm = inject('elForm', { props: {}, ctx: {} })
    const elFormItem = inject('elFormItem', {})
    provide('elCheckboxGroup', getCurrentInstance())

    const { dispatch, on } = useEmitter()

    const checkboxGroupSize = computed(() => {
      return props.size || elFormItem.elFormItemSize
    })

    const checkboxGroupDisabled = computed(() => {
      return props.disabled || elForm.disabled
    })

    on('update:modelValue', (v) => {
      emit('update:modelValue', v)
      dispatch('el.form.change', v)
    })

    on('change', (v) => {
      emit('change', v)
    })

    return {
      checkboxGroupSize,
      checkboxGroupDisabled
    }
  }
}
</script>
