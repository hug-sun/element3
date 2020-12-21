import { isRef } from 'vue'
import { isNumber, isString } from '../../../utils/types'

export const STATUS_SETTING = {
  success: 'el-icon-circle-check',
  warning: 'el-icon-warning',
  exception: 'el-icon-circle-close'
}
export const STATUSES = Object.keys(STATUS_SETTING)

export const statusValid = (val) => STATUSES.includes(val)
export const percentageValid = (val) => isNumber(val) && val >= 0 && val <= 100

export const props = {
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
    default: 6
  }
}

export function getColorsIndex(colors, percent) {
  const i = colors.findIndex((c) => percent < c.percentage)
  return i < 0 ? colors.length - 1 : i
}

export function getRefValue(ref) {
  return isRef(ref) ? ref.value : ref
}

export function sortByPercentage(pre, next) {
  return pre.percentage - next.percentage
}

export function toPercentageColors(colors) {
  const span = 100 / colors.length
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
  if (percentage > 100) {
    return 100
  }
  return percentage
}
