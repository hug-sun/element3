<template>
  <div :class="rootClass">
    <div class="el-progress-bar" v-if="type === 'line'">
      <div class="el-progress-bar__outer" :style="barOuterStyle">
        <div class="el-progress-bar__inner" :style="barStyle">
          <div class="el-progress-bar__innerText" v-if="showText && textInside">
            {{ content }}
          </div>
        </div>
      </div>
    </div>
    <div class="el-progress-circle" v-else :style="circleStyle">
      <svg :viewBox="viewBox">
        <path
          class="el-progress-circle__track"
          stroke="#e5e9f2"
          :stroke-width="svgStrokeWidth"
          fill="none"
          :d="svgPathD"
          :style="trailPathStyle"
        ></path>
        <path
          class="el-progress-circle__path"
          :stroke="svgStrokeColor"
          :stroke-width="svgStrokeWidth"
          :stroke-linecap="strokeLinecap"
          fill="none"
          :d="svgPathD"
          :style="arcPathStyle"
        ></path>
      </svg>
    </div>
    <div class="el-progress__text" v-if="showText && !textInside">
      <template v-if="!status">{{ content }}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs, unref } from 'vue'
import { isArray, isFunction, isString } from '../../../utils/types'
import {
  props,
  statusValid,
  autoFixPercentage,
  toPercentageColors,
  sortByPercentage,
  getColorsIndex,
  STATUS_SETTING,
  SVG_VIEW_BOX,
  calcRelativeSvgSize,
  generateSvgPathD,
  genTrailPathStyle,
  calcPerimeter,
  calcSvgRadius,
  genArcPathStyle,
  getSvgStrokeColor
} from './props'

export default defineComponent({
  name: 'ElProgress',
  props,
  setup(props) {
    const {
      percentage,
      format,
      color,
      strokeWidth,
      type,
      status,
      showText,
      textInside,
      width
    } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const barOuterStyle = useBarOuterStyle(strokeWidth)
    const content = useContent(format, percentage)
    console.debug('icon status:', status)
    const iconClass = useIconClass(status)
    const rootClass = useRootClass(type, status, showText, textInside)
    const circleStyle = useCircleStyle(width)
    const viewBox = SVG_VIEW_BOX
    const svgStrokeWidth = useSvgStrokeWidth(strokeWidth, width)
    const svgPathD = useSvgPathD(svgStrokeWidth)
    const trailPathStyle = useTrailPathStyle(svgStrokeWidth)
    const arcPathStyle = useArcPathStyle(svgStrokeWidth, percentage)
    console.debug('why type:', type)
    console.debug('why status:', status)
    const svgStrokeColor = useSvgStrokeColor(color, status)
    return {
      barStyle,
      barOuterStyle,
      content,
      iconClass,
      rootClass,
      circleStyle,
      viewBox,
      svgPathD,
      svgStrokeWidth,
      trailPathStyle,
      arcPathStyle,
      svgStrokeColor
    }
  }
})

const useRootClass = (type, status, showText, textInside) => {
  return computed(() => {
    const valType = unref(type)
    const valStatus = unref(status)
    const valShowText = unref(showText)
    const valTextInside = unref(textInside)
    const statusClass =
      valStatus && statusValid(valStatus) ? `is-${valStatus}` : ''
    return [
      'el-progress',
      `el-progress--${valType}`,
      statusClass,
      {
        'el-progress--without-text': !valShowText,
        'el-progress--text-inside': valTextInside
      }
    ]
  })
}

const useBarStyle = (percentage, color) => {
  return computed(() => {
    const pv = autoFixPercentage(unref(percentage))
    const cv = unref(color)
    let style = { width: `${pv}%` }
    if (isArray(cv)) {
      const cs = toPercentageColors(cv).sort(sortByPercentage)
      const i = getColorsIndex(cs, pv)
      style.backgroundColor = cs[i].color
    }
    if (isFunction(cv)) {
      style.backgroundColor = cv(pv)
    }
    if (isString(cv)) {
      style.backgroundColor = cv
    }
    return style
  })
}

const useBarOuterStyle = (strokeWidth) => {
  return computed(() => {
    const sw = unref(strokeWidth)
    return { height: sw + 'px' }
  })
}

const useContent = (format, percentage) => {
  return computed(() => {
    const fv = unref(format)
    const pv = autoFixPercentage(unref(percentage))
    if (typeof fv === 'function') {
      return fv(pv) || ''
    } else {
      return `${pv}%`
    }
  })
}

const useIconClass = (status) => {
  return computed(() => {
    const st = unref(status)
    return STATUS_SETTING[st] || ''
  })
}

const useCircleStyle = (width) => {
  return computed(() => {
    const val = unref(width) + 'px'
    return { width: val, height: val }
  })
}

const useSvgStrokeWidth = (strokeWidth, width) => {
  return computed(() => {
    const sw = unref(strokeWidth)
    const w = unref(width)
    return calcRelativeSvgSize(sw, w)
  })
}

const useSvgPathD = (svgStrokeWidth) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    return generateSvgPathD(ssw)
  })
}

const useTrailPathStyle = (svgStrokeWidth) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    const radius = calcSvgRadius(ssw)
    const perimeter = calcPerimeter(radius)
    return genTrailPathStyle(perimeter)
  })
}

const useArcPathStyle = (svgStrokeWidth, percentage) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    const radius = calcSvgRadius(ssw)
    const perimeter = calcPerimeter(radius)
    const percent = unref(percentage)
    return genArcPathStyle(perimeter, percent)
  })
}

const useSvgStrokeColor = (color, status) => {
  return computed(() => {
    const c = unref(color)
    const s = unref(status)
    return getSvgStrokeColor(c, s)
  })
}
</script>

<style></style>
