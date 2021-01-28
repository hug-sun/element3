import { isArray, isNumber, isString, isFunction } from '../../../utils/types'
import { PropType } from 'vue'
import { isEmpty } from '../../../utils/util'
import {
  AnyColor,
  FnColor,
  LevelColor,
  ProgressProps,
  StrokeStyle,
  FnFormat
} from './types'

export const DEFAULT_COLOR = '#409EFF'
export const STATUS_SETTING = {
  success: {
    color: '#67c23a',
    lineIconClass: 'el-icon-circle-check',
    arcIconClass: 'el-icon-check'
  },
  warning: {
    color: '#e6a23c',
    lineIconClass: 'el-icon-warning',
    arcIconClass: 'el-icon-warning'
  },
  exception: {
    color: '#f56c6c',
    lineIconClass: 'el-icon-circle-close',
    arcIconClass: 'el-icon-close'
  }
}
export const STATUSES = Object.keys(STATUS_SETTING)
export const TYPES = ['line', 'circle', 'dashboard']
export const LINECAPS = ['butt', 'round', 'square']

export const statusValid = (val: string): boolean =>
  isEmpty(val) || (!isEmpty(val) && STATUSES.includes(val))
export const percentageValid = (val: number): boolean =>
  isNumber(val) && val >= 0 && val <= 100
export const typeValid = (val: string): boolean => TYPES.includes(val)
export const linecapValid = (val: string): boolean => LINECAPS.includes(val)

export const FULL_PERCENT = 100
export const DEFAULT_SVG_PX = 126
export const DEFAULT_STROKE_PX = 6
export const SVG_MAX_SIZE = 100
export const SVG_VIEW_BOX = generateViewBox(SVG_MAX_SIZE)
export const DEFAULT_FIXED = 1
export const RATE_CIRCLE = 1
export const DASHBOARD_RATE = 0.75
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
  format: {
    type: Function as PropType<FnFormat>
  },
  status: {
    type: String,
    default: '',
    required: false,
    validator: statusValid
  },
  color: {
    type: [String, Function, Array] as PropType<AnyColor>,
    default: ''
  },
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

export function getColorsIndex(colors: LevelColor[], percent: number): number {
  const i = colors.findIndex((c) => percent < c.percentage)
  return i < 0 ? colors.length - 1 : i
}

export function sortByPercentage(
  pre: ProgressProps,
  next: ProgressProps
): number {
  return pre.percentage - next.percentage
}

export function toPercentageColors(colors: any[]): any[] {
  const span = FULL_PERCENT / colors.length
  return colors.map((color, i) => {
    if (isString(color)) {
      return { color, percentage: span * (i + 1) }
    }
    return color
  })
}

export function autoFixPercentage(percentage: number): number {
  if (percentage < 0) {
    return 0
  }
  if (percentage > FULL_PERCENT) {
    return FULL_PERCENT
  }
  return percentage
}

export function generateViewBox(size: number): string {
  return `0 0 ${size} ${size}`
}

export function generateSvgPathD(strokeWidth: number, type?: string): string {
  const half = SVG_MAX_SIZE / 2
  const radius = calcSvgRadius(strokeWidth)
  const diameter = radius * 2
  const isDashboard = type === 'dashboard'
  const fromTo = isDashboard ? '' : '-'
  const toFrom = isDashboard ? '-' : ''
  const d = `M ${half} ${half} m 0 ${fromTo}${radius} a ${radius} ${radius} 0 1 1 0 ${toFrom}${diameter} a ${radius} ${radius} 0 1 1 0 ${fromTo}${diameter}`
  return d
}

export function genFnToRelativeSvgSize(
  width: number
): (size: number) => number {
  return (size: number): number => {
    return (size / width) * SVG_MAX_SIZE
  }
}

export function toFixedStr(f: number): string {
  return f.toFixed(DEFAULT_FIXED)
}

export function calcRelativeSvgSize(size: number, width: number): number {
  return Number.parseFloat(toFixedStr(genFnToRelativeSvgSize(width)(size)))
}

export function calcSvgRadius(strokeWidth: number): number {
  return SVG_MAX_SIZE / 2 - strokeWidth / 2
}

export function calcPerimeter(radius: number): number {
  return 2 * Math.PI * radius
}

export function genTrailPathStyle(
  perimeter: number,
  type = 'circle'
): StrokeStyle {
  const rate = getRate(type)
  const offset = toFixedStr(getOffset(perimeter, rate))
  const range = toFixedStr(perimeter * rate)
  const all = toFixedStr(perimeter)
  const strokeDasharray = `${range}px, ${all}px`
  const strokeDashoffset = `${offset}px`
  return { strokeDasharray, strokeDashoffset }
}

export function getRate(type: string): number {
  return type === 'dashboard' ? DASHBOARD_RATE : 1
}

export function genArcPathStyle(
  perimeter: number,
  percentage = 0,
  type = 'circle'
): StrokeStyle {
  const rate = getRate(type)
  const offset = toFixedStr(getOffset(perimeter, rate))
  const p = toFixedStr(perimeter * (percentage / FULL_PERCENT) * rate)
  const s = toFixedStr(perimeter)
  const strokeDasharray = `${p}px, ${s}px`
  const strokeDashoffset = `${offset}px`
  const transition = TRANSITION
  return { strokeDasharray, strokeDashoffset, transition }
}

export function getSvgStrokeColor(
  status?: string,
  color?: AnyColor,
  percentage?: number
): AnyColor {
  if (!isEmpty(color)) {
    return getColorBy(color, percentage)
  }
  if (!isEmpty(status)) {
    return STATUS_SETTING[status].color
  }
  return DEFAULT_COLOR
}

export function getOffset(perimeter: number, rate: number): number {
  return (-1 * perimeter * (1 - rate)) / 2
}

export function getColorBy(color: AnyColor, percentage: number): AnyColor {
  if (isArray(color)) {
    const colors = color as LevelColor[]
    const cs = toPercentageColors(colors).sort(sortByPercentage)
    const i = getColorsIndex(cs, percentage)
    return cs[i].color
  }
  if (isFunction(color)) {
    const fnColor = color as FnColor
    return fnColor(percentage)
  }
  if (isString(color)) {
    return color
  }
}
