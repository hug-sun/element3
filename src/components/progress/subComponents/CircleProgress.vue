<script lang="ts" setup>
import { computed, withDefaults } from 'vue'

interface CircleProgressType {
  type: 'circle' | 'dashboard'
  status?: 'success' | 'error' | 'warning'
  color?: string
  processing?: boolean
  percentage?: number
  showIndicator?: boolean
  height?: number
}

const props = withDefaults(defineProps<CircleProgressType>(), {
  processing: false,
  percentage: 0,
  showIndicator: true,
})

function useCircleClass(props: CircleProgressType) {
  return computed(() => {
    return [
      'el-progress',
      'el-progress--circle',
      props.status ? `is-${props.status}` : '',
      props.processing ? 'is-processing' : '',
    ]
  })
}

function useStatus(props: CircleProgressType) {
  return computed(() => {
    return `el-icon-${props.status}`
  })
}

function useBarSize(props: CircleProgressType) {
  return computed(() => {
    const diam = props.height ? props.height + 110 : 110
    const center = diam / 2
    const radius = diam / 2 - diam / 15
    const perimeter = Math.ceil(radius * 3.14 * 2)
    const arc = perimeter * 3 / 4

    return {
      diam,
      center,
      radius,
      perimeter,
      arc,
    }
  })
}

function useCircleStyle(props: CircleProgressType, barSize) {
  return computed(() => {
    if (props.type === 'dashboard') {
      return {
        strokeWidth: `${barSize.value.diam / 15}px`,
        strokeDasharray: `${barSize.value.arc}px, ${barSize.value.arc * 4}px`,
        transform: 'rotate(225deg)',
        transformOrigin: 'center',
      }
    }
    return {
      strokeWidth: `${barSize.value.diam / 15}px`,
      strokeDasharray: `${barSize.value.perimeter}px`,
    }
  })
}

function useBarStyle(props: CircleProgressType, barSize) {
  return computed(() => {
    const length = Math.ceil((100 - props.percentage) / 100 * barSize.value.perimeter)
    const color = props.color

    if (props.type === 'dashboard') {
      return {
        strokeDashoffset: `${length * 3 / 4}px`,
        stroke: color,
      }
    }
    return {
      strokeDashoffset: `${length}px`,
      stroke: color,
    }
  })
}

function useFontSize(props: CircleProgressType) {
  if (props.height) {
    return computed(() => {
      const fontSize = Math.floor((props.height + 110) / 110 * 14)
      return { fontSize: `${fontSize}px` }
    })
  }
}

const circleClass = useCircleClass(props)
const statusClass = useStatus(props)
const barSize = useBarSize(props)
const circleStyle = useCircleStyle(props, barSize)
const barStyle = useBarStyle(props, barSize)
const fontSize = useFontSize(props)
const circleAndBarStyle = computed(() => {
  return {
    ...circleStyle.value,
    ...barStyle.value,
  }
})
</script>

<template>
  <div :class="circleClass">
    <div class="el-progress-circle">
      <svg :width="barSize.diam" :height="barSize.diam" :viewBox="`0 0 ${barSize.diam} ${barSize.diam}`">
        <path
          :d="`M ${barSize.diam / 2},${barSize.diam / 2} m 0,-${barSize.radius}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,${barSize.radius * 2}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,-${barSize.radius * 2}`"
          class="el-circle"
          :style="circleStyle"
        />
        <path
          :d="`M ${barSize.diam / 2},${barSize.diam / 2} m 0,-${barSize.radius}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,${barSize.radius * 2}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,-${barSize.radius * 2}`"
          class="el-circle el-circle__bar"
          :style="circleAndBarStyle"
        />
        <path
          v-if="processing"
          :d="`M ${barSize.diam / 2},${barSize.diam / 2} m 0,-${barSize.radius}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,${barSize.radius * 2}
              a ${barSize.radius},${barSize.radius} 0 1 1 0,-${barSize.radius * 2}`"
          class="el-circle el-circle__processing"
          :style="circleAndBarStyle"
        />
      </svg>
    </div>
    <div
      v-if="showIndicator"
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
