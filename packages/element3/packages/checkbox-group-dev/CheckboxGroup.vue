<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { provide, getCurrentInstance } from 'vue'
export default {
  name: 'CheckboxGroup',
  setup() {
    const checkboxGroupInstance = getCurrentInstance()
    provide('elCheckboxGroup', checkboxGroupInstance)
  },
  props: {
    modelValue: { type: Array, default: () => [] }
  }
}
</script>

<style scoped></style>
