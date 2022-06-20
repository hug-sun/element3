<script setup lang="ts">
import { withDefaults } from 'vue'
type CardType = 'always' | 'hover' | 'never'

interface CardProps {
  header?: String
  bodyStyle?: Object
  shadow?: CardType
}

withDefaults(defineProps<CardProps>(), {
  shadow: 'always',
  bodyStyle: { padding: '20px' }
})
</script>

<template>
  <div
    class="el-card"
    :class="`is-${shadow}-shadow`"
  >
    <div v-if="$slots.header || header" class="el-card__header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/card.scss';
</style>
