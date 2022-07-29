<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { computed, getCurrentInstance } from 'vue'
type disabledType = false | true
type borderType = false | true
type sizeType = 'medium' | 'small' | 'mini'

interface RadioProps {
  modelValue?: string | number | boolean
  label?: string | number | boolean
  disabled?: disabledType
  border?: borderType
  size?: sizeType
  name?: string
}

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
  border: false,
})

const emit = defineEmits(['update:modelValue', 'change', 'updateValue'])
const { parent, appContext }: ComponentInternalInstance = getCurrentInstance()
// console.log(parent);
// console.log(parent?.props?.size);
// console.log(parent?.type?.__name);

const model = useModel(props)
const disabled = useDisable(props)
const size = useSize(props)
const classes = useClasses(props)
const spanClasses = useSpanClasses(props)

function useClasses(props: RadioProps) {
  return computed(() => {
    return [
      'el-radio',
      (model.value) === props.label ? 'is-checked' : '',
      disabled.value ? 'is-disabled' : '',
      props.border ? 'is-bordered' : '',
      (props.border && size.value) ? `el-radio--${size.value}` : '',
    ]
  })
}

function useSpanClasses(props: RadioProps) {
  return computed(() => {
    return [
      'el-radio__input',
      (model.value) === props.label ? 'is-checked' : '',
      disabled.value ? 'is-disabled' : '',
    ]
  })
}

function useModel(props: RadioProps) {
  return computed(() => {
    return (parent?.type?.__name) === 'RadioGroup' ? (parent?.props?.modelValue) : (props.modelValue)
  })
}
function useDisable(props: RadioProps) {
  return computed(() => {
    return (parent?.type?.__name) === 'RadioGroup' ? (parent?.props?.disabled || props.disabled) : (props.disabled)
  })
}

function useSize(props: RadioProps) {
  return computed(() => {
    return (parent?.type?.__name) === 'RadioGroup' ? (parent?.props?.size) : (props.size)
  })
}

function handleFocus() {
  emit('update:modelValue', props.label)
  emit('change', props.label)
}
</script>

<template>
  <label role="radio" aria-checked="true" tabindex="0" :class="classes">
    <span :class="spanClasses">
      <span class="el-radio__inner" />
      <input
        ref="radio" type="radio" aria-hidden="true" tabindex="-1" autocomplete="off" class="el-radio__original"
        :value="model" :name="props.name" :disabled="props.disabled" @focus="handleFocus"
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
