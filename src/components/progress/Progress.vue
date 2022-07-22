<script lang="ts" setup>
import { withDefaults } from 'vue'

import LineProgress from './subComponents/LineProgress.vue'
import CircleProgress from './subComponents/CircleProgress.vue'

interface ProgressType {
  type?: 'line' | 'circle' | 'dashboard'
  status?: 'success' | 'error' | 'warning'
  color?: string
  processing?: boolean
  percentage?: number
  showIndicator?: boolean
  height?: number
  indicatorPlacement?: 'inside' | 'outerside'
}

withDefaults(defineProps<ProgressType>(), {
  type: 'line',
  processing: false,
  percentage: 0,
  indicatorPlacement: 'outerside',
  showIndicator: true,
})
</script>

<template>
  <line-progress
    v-if="type === 'line'"
    :color="color"
    :status="status"
    :processing="processing"
    :percentage="percentage"
    :height="height"
    :show-indicator="showIndicator"
    :indicator-placement="indicatorPlacement"
  />

  <circle-progress
    v-if="type === 'circle' || type === 'dashboard'"
    :type="type"
    :color="color"
    :status="status"
    :processing="processing"
    :percentage="percentage"
    :height="height"
    :show-indicator="showIndicator"
  />
</template>

<style lang="scss">
@import '../../theme/src/progress.scss'
</style>
