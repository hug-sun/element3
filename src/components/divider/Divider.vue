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

const isDark = computed(() => props.dark)
</script>

<template>
  <div v-bind="$attrs" class="el-divider" :class="[`el-divider--${direction}`, `is-${dividerStyle}`]" :style="{ color }">
    <div
      v-if="$slots.default && direction !== 'vertical'"
      class="el-divider__text" :class="[`is-${contentPosition}`, isDark ? 'is-dark' : '']"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/divider.scss'
</style>
