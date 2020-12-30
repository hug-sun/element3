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
    <div
      class="el-progress__text"
      v-if="showText && !textInside"
      :style="textStyle"
    >
      <template v-if="!status">{{ content }}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs, unref } from 'vue'
import {
  props,
  statusValid,
  autoFixPercentage,
  STATUS_SETTING,
  SVG_VIEW_BOX,
  calcRelativeSvgSize,
  generateSvgPathD,
  genTrailPathStyle,
  calcPerimeter,
  calcSvgRadius,
  genArcPathStyle,
  getSvgStrokeColor,
  getColorBy
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
    const iconClass = useIconClass(status, type)
    const rootClass = useRootClass(type, status, showText, textInside)
    const circleStyle = useCircleStyle(width)
    const viewBox = SVG_VIEW_BOX
    const svgStrokeWidth = useSvgStrokeWidth(strokeWidth, width)
    const svgPathD = useSvgPathD(svgStrokeWidth, type)
    const trailPathStyle = useTrailPathStyle(svgStrokeWidth, type)
    const arcPathStyle = useArcPathStyle(svgStrokeWidth, percentage, type)
    const svgStrokeColor = useSvgStrokeColor(status, color, percentage)
    const textStyle = useTextStyle(type, width)
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
      svgStrokeColor,
      textStyle
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
    const backgroundColor = getColorBy(cv, pv)
    return { width: `${pv}%`, backgroundColor }
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

const useIconClass = (status, type) => {
  return computed(() => {
    const st = unref(status)
    const t = unref(type) === 'line' ? 'lineIconClass' : 'arcIconClass'
    const stat = STATUS_SETTING[st]
    return (stat && stat[t]) || ''
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

const useSvgPathD = (svgStrokeWidth, type) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    const tv = unref(type)
    return generateSvgPathD(ssw, tv)
  })
}

const useTrailPathStyle = (svgStrokeWidth, type) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    const radius = calcSvgRadius(ssw)
    const perimeter = calcPerimeter(radius)
    const tv = unref(type)
    return genTrailPathStyle(perimeter, tv)
  })
}

const useArcPathStyle = (svgStrokeWidth, percentage, type) => {
  return computed(() => {
    const ssw = unref(svgStrokeWidth)
    const radius = calcSvgRadius(ssw)
    const perimeter = calcPerimeter(radius)
    const percent = autoFixPercentage(unref(percentage))
    const tv = unref(type)
    return genArcPathStyle(perimeter, percent, tv)
  })
}

const useSvgStrokeColor = (status, color, percentage) => {
  return computed(() => {
    const s = unref(status)
    const c = unref(color)
    const p = autoFixPercentage(unref(percentage))
    return getSvgStrokeColor(s, c, p)
  })
}

/**
 * Only change when type is not 'line'
 */
const useTextStyle = (type, width) => {
  return computed(() => {
    const t = unref(type)
    const w = unref(width)
    const fontSize = (w * 0.11 + 2).toFixed() + 'px'
    return t === 'line' ? '' : { fontSize }
  })
}
</script>

<style></style>
