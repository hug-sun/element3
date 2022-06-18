<script setup lang="ts">
import { withDefaults } from 'vue'
interface DividerType {
  direction?: 'horizontal' | 'vertical'
  contentPosition?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<DividerType>(), {
  direction: 'horizontal',
  contentPosition: 'center',
})
</script>

<template>
  <div v-bind="$attrs" class="el-divider" :class="[`el-divider--${direction}`]">
    <div
      v-if="$slots.default && direction !== 'vertical'"
      class="el-divider__text" :class="[`is-${contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/divider.scss'
</style>
