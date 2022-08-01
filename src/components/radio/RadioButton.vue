<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { computed, getCurrentInstance } from 'vue'
type disabledType = false | true

interface RadioProps {
  label?: string | number
  disabled?: disabledType
  name?: string
}

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

const emit = defineEmits(['update:modelValue', 'updateValue'])
const { parent }: ComponentInternalInstance = getCurrentInstance()
const model = useModel(props)
const classes = useClasses(props)
const active = isActive(props)
const label = useLabel(props)
const spanStyle = useStyle(props)

function useStyle(props: RadioProps) {
  return computed(() => {
    return {
      backgroundColor: `${parent?.props?.fill}`,
      borderColor: `${parent?.props?.fill}`,
      color: `${parent?.props?.textColor}`,
    }
  })
}
function useClasses(props: RadioProps) {
  return computed(() => {
    return [
      'el-radio-button',
      (model.value) === props.label ? 'is-active' : '',
      props.disabled ? 'is-disabled' : '',
      (parent?.props?.size) ? `el-radio-button--${(parent?.props?.size)}` : '',
    ]
  })
}
function useModel(props: RadioProps) {
  return computed(() => {
    return parent?.props?.modelValue
  })
}
function useLabel(props: RadioProps) {
  return computed(() => props.label)
}

function isActive(props: RadioProps) {
  return computed(() => {
    return model.value === props.label
  })
}

function handleFocus() {
  emit('update:modelValue', props.label)
  emit('updateValue', props.label)
  parent.emit('update:modelValue', props.label)
}
</script>

<template>
  <label :class="classes" role="radio" :aria-checked="active" :tabindex="active ? 0 : -1">
    <input
      class="el-radio-button__orig-radio" :name="props.name" type="radio" :value="label" tabindex="-1"
      @focus="handleFocus"
    >
    <span class="el-radio-button__inner" :style="active ? spanStyle : ''">{{ label }}</span>
  </label>
</template>

<style lang="scss">
@import '../../theme/src/radio-button.scss';
</style>
