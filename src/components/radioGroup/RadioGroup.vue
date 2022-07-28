<script setup lang="ts">
import { computed, ref } from 'vue'
type disabledType = false | true

interface RadioProps {
  value?: string | number | boolean
  label?: string | number | boolean
  disabled?: disabledType
}

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

// const emit = defineEmits(['update', 'change'])

const model = ref(props.value)
const xxx = ref('lk')

function useDisabled(props: RadioProps) {
  return computed(() => props.disabled)
}

const disabled = useDisabled(props)

function changeRadio(e) {

}

function handleFocus() {
}

function handleChange() {
}
</script>

<template>
  <div class="el-radio-group" role="radiogroup">
    <div style="width: 100px;height: 100px;color: pink;">
      <input type="text" :value="$slots">
    </div>
    <span v-if="$slots.default">

      <slot />
    </span>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/radio-group.scss';
</style>
