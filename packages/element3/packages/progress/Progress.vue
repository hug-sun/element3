<template>
  <div
    class="el-progress"
    :class="[
      'el-progress--' + type,
      status ? 'is-' + status : '',
      {
        'el-progress--without-text': !showText,
        'el-progress--text-inside': textInside
      }
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="el-progress-bar" v-if="type === 'line'">
      <div
        class="el-progress-bar__outer"
        :style="{ height: strokeWidth + 'px' }"
      >
        <div class="el-progress-bar__inner" :style="barStyle">
          <div class="el-progress-bar__innerText" v-if="showText && textInside">
            {{ content }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="el-progress-circle"
      :style="{ height: width + 'px', width: width + 'px' }"
      v-else
    >
      <svg viewBox="0 0 100 100">
        <path
          class="el-progress-circle__track"
          :d="trackPath"
          stroke="#e5e9f2"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        />
        <path
          class="el-progress-circle__path"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          :stroke-linecap="strokeLinecap"
          :stroke-width="percentage ? relativeStrokeWidth : 0"
          :style="circlePathStyle"
        />
      </svg>
    </div>
    <div
      class="el-progress__text"
      v-if="showText && !textInside"
      :style="{ fontSize: progressTextSize + 'px' }"
    >
      <template v-if="!status">{{ content }}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>
<script>
import { computed, toRefs } from 'vue'
export default {
  name: 'ElProgress',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: (val) => ['line', 'circle', 'dashboard'].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val) => val >= 0 && val <= 100
    },
    status: {
      type: String,
      validator: (val) => ['success', 'exception', 'warning'].indexOf(val) > -1
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeLinecap: {
      type: String,
      default: 'round',
      validator: (val) => ['butt', 'round', 'square'].indexOf(val) > -1
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: [String, Array, Function],
      default: ''
    },
    format: Function
  },
  setup(props) {
    const {
      percentage,
      color,
      strokeWidth,
      width,
      type,
      status,
      format
    } = toRefs(props)

    const getCurrentColor = (percentage) => {
      if (typeof color.value === 'function') {
        return color.value(percentage)
      } else if (typeof color.value === 'string') {
        return color.value
      } else {
        return getLevelColor(percentage)
      }
    }

    const getLevelColor = (percentage) => {
      const colorArray = getColorArray().sort(
        (a, b) => a.percentage - b.percentage
      )

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color
        }
      }
      return colorArray[colorArray.length - 1].color
    }

    const getColorArray = () => {
      const span = 100 / color.value.length
      return color.value.map((seriesColor, index) => {
        if (typeof seriesColor === 'string') {
          return {
            color: seriesColor,
            progress: (index + 1) * span
          }
        }
        return seriesColor
      })
    }

    const barStyle = useBarStyle(percentage, getCurrentColor)
    const relativeStrokeWidth = useRelativeStrokeWidth(strokeWidth, width)
    const radius = useRadius(type, relativeStrokeWidth)
    const trackPath = useTrackPath(radius, type)
    const perimeter = usePerimeter(radius)
    const rate = useRate(type)
    const strokeDashoffset = useStrokeDashoffset(perimeter, rate)
    const trailPathStyle = useTrailPathStyle(perimeter, rate, strokeDashoffset)
    const circlePathStyle = useCirclePathStyle(
      perimeter,
      rate,
      percentage,
      strokeDashoffset
    )
    const stroke = useStroke(color, getCurrentColor, percentage, status)
    const iconClass = useIconClass(status, type)
    const progressTextSize = useProgressTextSize(type, strokeWidth, width)
    const content = useContent(format, percentage)

    return {
      barStyle,
      relativeStrokeWidth,
      trackPath,
      trailPathStyle,
      circlePathStyle,
      stroke,
      iconClass,
      progressTextSize,
      content
    }
  }
}

const useBarStyle = (percentage, getCurrentColor) => {
  const barStyle = computed(() => {
    const style = {}
    style.width = percentage.value + '%'
    style.backgroundColor = getCurrentColor(percentage.value)
    return style
  })
  return barStyle
}

const useRelativeStrokeWidth = (strokeWidth, width) => {
  const relativeStrokeWidth = computed(() => {
    return ((strokeWidth.value / width.value) * 100).toFixed(1)
  })
  return relativeStrokeWidth
}

const useRadius = (type, relativeStrokeWidth) => {
  const radius = computed(() => {
    if (type.value === 'circle' || type.value === 'dashboard') {
      return parseInt(50 - parseFloat(relativeStrokeWidth.value) / 2, 10)
    } else {
      return 0
    }
  })
  return radius
}

const useTrackPath = (radius, type) => {
  const trackPath = computed(() => {
    const isDashboard = type.value === 'dashboard'
    return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius.value}
          a ${radius.value} ${radius.value} 0 1 1 0 ${isDashboard ? '-' : ''}${
      radius.value * 2
    }
          a ${radius.value} ${radius.value} 0 1 1 0 ${isDashboard ? '' : '-'}${
      radius.value * 2
    }
          `
  })
  return trackPath
}

const usePerimeter = (radius) => {
  const perimeter = computed(() => {
    return 2 * Math.PI * radius.value
  })
  return perimeter
}

const useRate = (type) => {
  const rate = computed(() => {
    return type.value === 'dashboard' ? 0.75 : 1
  })
  return rate
}

const useStrokeDashoffset = (perimeter, rate) => {
  const strokeDashoffset = computed(() => {
    const offset = (-1 * perimeter.value * (1 - rate.value)) / 2
    return `${offset}px`
  })
  return strokeDashoffset
}

const useTrailPathStyle = (perimeter, rate, strokeDashoffset) => {
  const trailPathStyle = computed(() => {
    return {
      strokeDasharray: `${perimeter.value * rate.value}px, ${
        perimeter.value
      }px`,
      strokeDashoffset: strokeDashoffset.value
    }
  })
  return trailPathStyle
}

const useCirclePathStyle = (perimeter, rate, percentage, strokeDashoffset) => {
  const circlePathStyle = computed(() => {
    return {
      strokeDasharray: `${
        perimeter.value * rate.value * (percentage.value / 100)
      }px, ${perimeter.value}px`,
      strokeDashoffset: strokeDashoffset.value,
      transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
    }
  })
  return circlePathStyle
}

const useStroke = (color, getCurrentColor, percentage, status) => {
  const stroke = computed(() => {
    const statusValue = status && status.value
    let ret
    if (color.value) {
      ret = getCurrentColor(percentage.value)
    } else {
      switch (statusValue) {
        case 'success':
          ret = '#13ce66'
          break
        case 'exception':
          ret = '#ff4949'
          break
        case 'warning':
          ret = '#e6a23c'
          break
        default:
          ret = '#20a0ff'
      }
    }
    return ret
  })
  return stroke
}

const useIconClass = (status, type) => {
  const iconClass = computed(() => {
    if (status.value === 'warning') {
      return 'el-icon-warning'
    }
    if (type.value === 'line') {
      return status.value === 'success'
        ? 'el-icon-circle-check'
        : 'el-icon-circle-close'
    } else {
      return status.value === 'success' ? 'el-icon-check' : 'el-icon-close'
    }
  })
  return iconClass
}

const useProgressTextSize = (type, strokeWidth, width) => {
  const progressTextSize = computed(() => {
    return type.value === 'line'
      ? 12 + strokeWidth.value * 0.4
      : width.value * 0.111111 + 2
  })
  return progressTextSize
}

const useContent = (format, percentage) => {
  const content = computed(() => {
    if (format && typeof format.value === 'function') {
      return format.value(percentage.value) || ''
    } else {
      return `${percentage.value}%`
    }
  })
  return content
}
</script>
