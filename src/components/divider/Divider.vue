<script setup lang="ts">
import { computed, withDefaults } from 'vue'
interface DividerType {
  direction?: 'horizontal' | 'vertical'
  contentPosition?: 'left' | 'center' | 'right'
  dividerStyle?: 'dotted' | 'dashed' | 'double' | 'solid'
  dark?: boolean
  color?: string
}

const props = withDefaults(defineProps<DividerType>(), {
  direction: 'horizontal',
  contentPosition: 'center',
  dividerStyle: 'solid',
  dark: false,
  color: '',
})

const calculateClasses = {
  divider: (props) => {
    return computed(() => {
      return [
        'el-divider',
        props.direction ? `el-divider--${props.direction}` : '',
        props.dividerStyle ? `is-${props.dividerStyle}` : '',
      ]
    })
  },
  defaultSlot: (props) => {
    return computed(() => {
      return [
        'el-divider__text',
        props.contentPosition ? `is-${props.contentPosition}` : '',
        props.dark ? 'is-dark' : '',
      ]
    })
  },
}

const dividerClasses = calculateClasses.divider(props)
const slotsClasses = calculateClasses.defaultSlot(props)
</script>

<template>
  <div
    v-bind="$attrs" :class="dividerClasses"
    :style="{ color }"
  >
    <div
      v-if="$slots.default && direction !== 'vertical'"
      :class="slotsClasses"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/divider.scss'
</style>
