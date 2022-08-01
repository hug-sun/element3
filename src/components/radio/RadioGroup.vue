<script setup lang="ts">
import { onUpdated } from 'vue'
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

onUpdated(() => {
  emit('change', props.modelValue)
})
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
