<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { provide, getCurrentInstance } from 'vue'
export default {
  name: 'ElCheckboxGroup',
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const update = (newValue) => {
      emit('update:modelValue', newValue)
    }
    const change = (newValue) => {
      emit('change', newValue)
    }

    provide('elCheckboxGroup', instance)

    return {
      update,
      change
    }
  },
  props: {
    modelValue: Array,
    size: {
      type: String,
      validator: (val) => {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    border: Boolean,
    disabled: Boolean,
    min: Number,
    max: Number
  }
}
</script>

<style scoped></style>
