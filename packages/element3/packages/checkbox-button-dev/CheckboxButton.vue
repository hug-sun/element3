<template>
  <label
    :class="[
      'el-checkbox-button',
      checkboxSize ? `el-checkbox-button--${checkboxSize}` : '',
      {
        'is-disabled': isDisabled
      }
    ]"
  >
    <input
      class="el-checkbox-button__original"
      type="checkbox"
      :disabled="isDisabled"
      :name="name"
    />
    <span class="el-checkbox-button__inner" v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { useSize, useDisabled } from '../checkbox-dev/common'
import { toRefs } from 'vue'
export default {
  name: 'ElCheckboxButton',
  props: {
    label: String,
    size: {
      type: String,
      validator: (val) => {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    disabled: Boolean,
    name: String
  },
  setup(props) {
    const { size, disabled } = toRefs(props)
    const { checkboxSize } = useSize(size)
    const { isDisabled } = useDisabled(disabled)

    return {
      checkboxSize,
      isDisabled
    }
  }
}
</script>

<style scoped lang="scss"></style>
