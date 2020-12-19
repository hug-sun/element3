<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { provide, toRefs } from 'vue'
export default {
  name: 'CheckboxGroup',
  setup(props) {
    const update = (v) => {
      console.log('checkbox-group v =>', v)
    }

    provide('elCheckboxGroup', {
      ...toRefs(props),
      update
    })
  },
  props: {
    modelValue: { type: Array, default: () => [] }
  }
}
</script>

<style scoped></style>
