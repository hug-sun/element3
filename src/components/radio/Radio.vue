<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { computed, getCurrentInstance, ref } from 'vue'
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

const emit = defineEmits(['update:modelValue', 'updateValue'])
const { parent, appContext }: ComponentInternalInstance = getCurrentInstance()
// console.log(parent);
// console.log(appContext);
// console.log(parent?.props?.modelValue);
// console.log(parent?.type?.__name);

// const instance = getCurrentInstance()
//   const _this = instance.appContext.config.globalProperties

const model = useModel(props)
const classes = useClasses(props)

function useClasses(props: RadioProps) {
  return computed(() => {
    return [
      'el-radio__input',
      (model.value) === props.label ? 'is-checked' : '',
      props.disabled ? 'is-disabled' : '',
    ]
  })
}
function useModel(props: RadioProps) {
  return computed(() => {
    return (parent?.type?.__name) === 'RadioGroup' ? (parent?.props?.modelValue) : (props.value || props.modelValue)
  })
}

function handleFocus() {
  emit('update:modelValue', props.label)
  emit('updateValue', props.label)
}
</script>

<template>
  <label
    role="radio" aria-checked="true" tabindex="0" class="el-radio"
    :class="[{ 'is-checked': model === props.label }]"
  >
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
