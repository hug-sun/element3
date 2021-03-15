<template>
  <!-- @blur="handleBlur" -->
  <div class="el-date-editor el-range-editor el-input__inner">
    <input
      :value="modelValue && modelValue[0]"
      @input="handleStartInput"
      @focus="handleFocus"
      :readonly="readonly"
    />
    <input
      :value="modelValue && modelValue[1]"
      @input="handleEndInput"
      @focus="handleFocus"
      :readonly="readonly"
    />
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { toRefs } from 'vue'
export default {
  name: 'InputRange',
  props,
  emits: ['update:modelValue', 'focus'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)

    const handleStartInput = function (event: any) {
      emit('update:modelValue', [event.target.value, modelValue[1]])
    }

    const handleEndInput = function (event: any) {
      emit('update:modelValue', [modelValue[0], event.target.value])
    }

    const handleFocus = function () {
      emit('focus', this)
    }

    // const handleBlur = function (event: any) {
    //   emit('blur', event)
    // }

    return { handleStartInput, handleEndInput, handleFocus }
  }
}
</script>
