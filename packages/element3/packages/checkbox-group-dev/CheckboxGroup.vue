<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { provide, toRefs } from 'vue'
export default {
  name: 'ElCheckboxGroup',
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const update = (newValue) => {
      emit('update:modelValue', newValue)
    }
    const change = (newValue) => {
      emit('change', newValue)
    }

    provide('elCheckboxGroup', {
      ...toRefs(props),
      update,
      change
    })
  },
  props: {
    modelValue: Array,
    size: {
      type: String,
      default: '',
      validator(val) {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    border: Boolean,
    disabled: Boolean,
    min: { type: Number, default: 0 }
  }
}
</script>

<style scoped></style>
