<script lang="ts" setup>
import { computed, withDefaults } from 'vue'

interface LineProgressType {
  status?: 'success' | 'error' | 'warning'
  color?: string
  processing?: boolean
  percentage?: number
  showIndicator?: boolean
  height?: number
  indicatorPlacement?: 'inside' | 'outerside'
}

const props = withDefaults(defineProps<LineProgressType>(), {
  processing: false,
  percentage: 0,
  indicatorPlacement: 'outerside',
  showIndicator: true,
})

function useLineClass(props) {
  return computed(() => {
    const indicator = !props.showIndicator || (props.indicatorPlacement === 'inside')
    return [
      'el-progress',
      'el-progress--line',
      props.status ? `is-${props.status}` : '',
      indicator ? 'el-progress--text-inside' : '',
      props.processing ? 'is-processing' : '',
    ]
  })
}

function useStatus(props) {
  return computed(() => {
    return `el-icon-${props.status}`
  })
}

function useBarStyle(props) {
  return computed(() => {
    return {
      width: `${props.percentage}%`,
      backgroundColor: props.color,
    }
  })
}

function useFontSize(props) {
  if (props.height) {
    return computed(() => {
      const fontSize = Math.max(Math.floor(props.height / 20 * 14), 14)
      return { fontSize: `${fontSize}px` }
    })
  }
}

const lineClass = useLineClass(props)
const statusClass = useStatus(props)
const barStyle = useBarStyle(props)
const fontSize = useFontSize(props)
</script>

<template>
  <div :class="lineClass">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer" :style="{ height: `${height}px` }">
        <div class="el-progress-bar__inner" :style="barStyle">
          <div
            v-if="indicatorPlacement === 'inside' && showIndicator"
            class="el-progress-bar__innerText"
          >
            {{ percentage }}%
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="indicatorPlacement === 'outerside' && showIndicator"
      class="el-progress__text"
      :style="fontSize"
    >
      <i
        v-if="status"
        :class="statusClass"
      />
      <span v-else> {{ percentage }}%</span>
    </div>
  </div>
</template>
