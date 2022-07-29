<script setup lang="ts">
import { computed, ref } from 'vue'
type disabledType = false | true
type sizeType = 'medium' | 'small' | 'mini'

interface RadioGroupProps {
  modelValue?: string | number | boolean
  disabled?: disabledType
  size?: sizeType
  textColor?: string
  fill?: string
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  textColor: '#ffffff',
  fill: '#409EFF',
})

const emit = defineEmits(['update:modelValue', 'change'])

function updateValue(value) {
  // emit('update:modelValue', props.label)
}
</script>

<template>
  <div class="el-radio-group" role="radiogroup">
    <!-- <input type="text" name="" id="" :value="props.modelValue"> -->
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/radio-group.scss';
</style>
