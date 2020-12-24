import { isNumber, isString } from '../../../utils/types'
import { isEmpty } from '../../../utils/util'

export const DEFAULT_COLOR = '#409EFF'
export const STATUS_SETTING = {
  success: 'el-icon-circle-check',
  warning: 'el-icon-warning',
  exception: 'el-icon-circle-close'
}
export const STATUS_COLOR = {
  success: '#20a0ff',
  warning: '#67c23a',
  exception: '#e6a23c'
}
export const STATUSES = Object.keys(STATUS_SETTING)
export const TYPES = ['line', 'circle', 'dashboard']
export const LINECAPS = ['butt', 'round', 'square']

export const statusValid = (val) => STATUSES.includes(val)
export const percentageValid = (val) => isNumber(val) && val >= 0 && val <= 100
export const typeValid = (val) => TYPES.includes(val)
export const linecapValid = (val) => LINECAPS.includes(val)

export const FULL_PERCENT = 100
export const DEFAULT_SVG_PX = 126
export const DEFAULT_STROKE_PX = 6
export const SVG_MAX_SIZE = 100
export const SVG_VIEW_BOX = generateViewBox(SVG_MAX_SIZE)
export const DEFAULT_FIXED = 1
export const RATE_CIRCLE = 1
export const RATE_DASHBOARD = 0.75
export const TRANSITION = 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s'

export const props = {
  type: {
    type: String,
    default: 'line',
    validator: typeValid
  },
  percentage: {
    type: Number,
    default: 0,
    required: true,
    validator: percentageValid
  },
  format: Function,
  status: {
    type: String,
    validator: statusValid
  },
  color: { type: [String, Function, Array], default: '' },
  showText: {
    type: Boolean,
    default: true
  },
  strokeWidth: {
    type: Number,
    default: DEFAULT_STROKE_PX
  },
  textInside: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: DEFAULT_SVG_PX
  },
  strokeLinecap: {
    type: String,
    default: 'round',
    validator: linecapValid
  }
}

export function getColorsIndex(colors, percent) {
  const i = colors.findIndex((c) => percent < c.percentage)
  return i < 0 ? colors.length - 1 : i
}

export function sortByPercentage(pre, next) {
  return pre.percentage - next.percentage
}

export function toPercentageColors(colors) {
  const span = FULL_PERCENT / colors.length
  return colors.map((color, i) => {
    if (isString(color)) {
      return { color, percentage: span * (i + 1) }
    }
    return color
  })
}

export function autoFixPercentage(percentage) {
  if (percentage < 0) {
    return 0
  }
  if (percentage > FULL_PERCENT) {
    return FULL_PERCENT
  }
  return percentage
}

export function generateViewBox(size) {
  return `0 0 ${size} ${size}`
}

export function generateSvgPathD(strokeWidth) {
  const half = SVG_MAX_SIZE / 2
  const radius = calcSvgRadius(strokeWidth)
  const diameter = radius * 2
  const d = `M ${half} ${half} m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${diameter} a ${radius} ${radius} 0 1 1 0 -${diameter}`
  return d
}

export function genFnToRelativeSvgSize(width) {
  return (size) => {
    return (size / width) * SVG_MAX_SIZE
  }
}

export function toFixedStr(f) {
  return f.toFixed(DEFAULT_FIXED)
}

export function calcRelativeSvgSize(size, width) {
  return toFixedStr(genFnToRelativeSvgSize(width)(size))
}

export function calcSvgRadius(strokeWidth) {
  return SVG_MAX_SIZE / 2 - strokeWidth / 2
}

export function calcPerimeter(radius) {
  return 2 * Math.PI * radius
}

export function genTrailPathStyle(perimeter) {
  const s = toFixedStr(perimeter)
  const strokeDasharray = `${s}px, ${s}px`
  const strokeDashoffset = `0px`
  return { strokeDasharray, strokeDashoffset }
}

export function genArcPathStyle(perimeter, percentage = 0) {
  const p = toFixedStr(perimeter * (percentage / FULL_PERCENT))
  const s = toFixedStr(perimeter)
  const strokeDasharray = `${p}px, ${s}px`
  const strokeDashoffset = `0px`
  const transition = TRANSITION
  return { strokeDasharray, strokeDashoffset, transition }
}

export function getSvgStrokeColor(color, status) {
  if (!isEmpty(color)) {
    return color
  }
  if (!isEmpty(status)) {
    return STATUS_COLOR[status]
  }
  return DEFAULT_COLOR
}
