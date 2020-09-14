<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { useEmitter } from 'element-ui/src/use/emitter'
import { provide, getCurrentInstance, computed, inject, watch } from 'vue'
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

  setup(props) {
    const elForm = inject('elForm', { props: {}, ctx: {} })
    const elFormItem = inject('elFormItem', {
      props: {},
      ctx: {},
      emit: () => {}
    })
    provide('elCheckboxGroup', getCurrentInstance())

    const { dispatch } = useEmitter()

    const checkboxGroupSize = computed(() => {
      return props.size || elFormItem.ctx.elFormItemSize
    })

    const checkboxGroupDisabled = computed(() => {
      return props.disabled || elFormItem.disabled || elForm.disabled
    })

    watch(props.modelValue, (v) => {
      dispatch('el.form.change', v)
    })

    return {
      checkboxGroupSize,
      checkboxGroupDisabled
    }
  }
}
</script>
