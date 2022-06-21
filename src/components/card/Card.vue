<script setup lang="ts">
import { withDefaults } from 'vue'
import type { StyleValue } from 'vue'
type CardType = 'always' | 'hover' | 'never'

interface CardProps {
  header?: String
  bodyStyle?: StyleValue
  shadow?: CardType
}

withDefaults(defineProps<CardProps>(), {
  shadow: 'always',
})
</script>

<template>
  <div
    class="el-card"
    :class="`is-${shadow}-shadow`"
  >
    <div v-if="$slots.header || header" class="el-card__header">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/card.scss';
</style>
