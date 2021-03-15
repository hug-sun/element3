<template>
  <!-- @blur="handleBlur" -->
  <div
    class="el-date-editor el-range-editor el-input__inner"
    :class="classes"
    data-testid="input-range"
  >
    <input
      :value="modelValue && modelValue[0]"
      @input="handleStartInput"
      @focus="handleFocus"
      :readonly="!editable || readonly"
      :disabled="disabled"
    />
    <input
      :value="modelValue && modelValue[1]"
      @input="handleEndInput"
      @focus="handleFocus"
      :readonly="!editable || readonly"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { toRefs, computed } from 'vue'
export default {
  name: 'InputRange',
  props,
  emits: ['update:modelValue', 'focus'],
  setup(props, { emit }) {
    const { modelValue, size } = toRefs(props)

    const handleStartInput = function (event: any) {
      emit('update:modelValue', [event.target.value, modelValue[1]])
    }

    const handleEndInput = function (event: any) {
      emit('update:modelValue', [modelValue[0], event.target.value])
    }

    const handleFocus = function () {
      emit('focus', this)
    }
    const classes = useClasses({ size })

    // const handleBlur = function (event: any) {
    //   emit('blur', event)
    // }

    return { handleStartInput, handleEndInput, handleFocus, classes }
  }
}

const useClasses = ({ size }) => {
  return computed(() => {
    return [size ? `el-range-editor--${size.value}` : '']
  })
}
</script>
