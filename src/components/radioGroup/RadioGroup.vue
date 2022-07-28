<script setup lang="ts">
import { computed, ref } from 'vue'
type disabledType = false | true

interface RadioGroupProps {
  modelValue?: string | number | boolean
  value?: string | number | boolean
  disabled?: disabledType
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  // emit('update:modelValue', props.label)
}
</script>

<template>
  <div class="el-radio-group" role="radiogroup">
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/radio-group.scss';
</style>
