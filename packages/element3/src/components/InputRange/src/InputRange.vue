<template>
  <div>
    <input :value="modelValue && modelValue[0]" @input="handleStartInput" />
    <input :value="modelValue && modelValue[1]" @input="handleEndInput" />
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { computed, toRefs } from 'vue'
export default {
  name: 'InputRange',
  props,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)

    const handleStartInput = function (event: { target: { value: any } }) {
      emit('update:modelValue', [event.target.value, modelValue[1]])
    }

    const handleEntInput = function (event: { target: { value: any } }) {
      emit('update:modelValue', [modelValue[0], event.target.value])
    }

    const userInputs = computed(() => {
      return modelValue
    })

    return { userInputs, handleStartInput, handleEntInput }
  }
}
</script>
