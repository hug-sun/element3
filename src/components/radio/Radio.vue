<script setup lang="ts">
import { computed, ref } from 'vue'
type disabledType = false | true

interface RadioProps {
  modelValue?: string | number | boolean
  value?: string | number | boolean
  label?: string | number | boolean
  disabled?: disabledType
}

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

const emit = defineEmits(['update:modelValue'])

const model = ref(props.value || props.modelValue)
// const disabled = useDisabled(props)
const classes = useClasses(props)

// function useDisabled(props: RadioProps) {
//   return computed(() => props.disabled)
// }

function useClasses(props: RadioProps) {
  return computed(() => {
    return [
      'el-radio__input',
      (props.modelValue || props.value) === props.label ? 'is-checked' : '',
      props.disabled ? 'is-disabled' : '',
    ]
  })
}

function handleFocus() {
  emit('update:modelValue', props.label)
}
</script>

<template>
  <label
    role="radio" aria-checked="true" tabindex="0" class="el-radio"
    :class="[{ 'is-checked': model === props.label }]"
  >
    <!-- <span class="el-radio__input" :class="[{ 'is-checked': model === props.label, 'is-disabled': disabled }]"> -->
    <span :class="classes">
      <span class="el-radio__inner" />
      <input
        ref="radio" type="radio" aria-hidden="true" tabindex="-1" autocomplete="off" class="el-radio__original"
        :value="model" :disabled="props.disabled" @focus="handleFocus"
      >
    </span>
    <span class="el-radio__label">
      <span v-if="$slots.default">
        <slot />
      </span>
    </span>
  </label>
</template>

<style lang="scss">
@import '../../theme/src/radio.scss';
</style>
