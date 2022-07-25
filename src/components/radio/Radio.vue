<script setup lang="ts">
import { computed, ref } from 'vue'
type disabled = false | true

interface RadioProps {
  value?: string | number | boolean
  label?: string | number | boolean
}
const props = defineProps<RadioProps>()

const emit = defineEmits(['update', 'change'])

const model = ref(props.value)
const xxx = ref(1)

function useClasses(props: RadioProps) {
  return computed(() => {
    return [
      props.label === model.value ? 'is-checked' : '',
    ]
  })
}

const classes = useClasses(props)

function changeRadio(e) {
  // console.log('电解铝', e);

}

function handleFocus() {
}

function handleChange() {
  // console.log('电解铝12', props.label);
  model.value = props.label
  // console.log('电解铝12', model.value);
  // console.log('电解铝12', props);
  // xxx.value++
  emit('change', model.value)
  emit('update', model.value)
  // dispatch('update:modelValue', modelValue)
}
</script>

<template>
  <div>
    <label
      role="radio" aria-checked="true" tabindex="0" class="el-radio"
      :class="[{ 'is-checked': model === props.label }]" @click="changeRadio"
    >
      <span class="el-radio__input" :class="[{ 'is-checked': model === props.label }]">
        <span class="el-radio__inner" />
        <input
          ref="radio" type="radio" aria-hidden="true" tabindex="-1" autocomplete="off"
          class="el-radio__original" :value="model" @focus="handleFocus" @change="handleChange"
        >
      </span>
      <span class="el-radio__label">
        <span v-if="$slots.default">
          <slot />
        </span>
      </span>
    </label>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/radio.scss';
</style>
