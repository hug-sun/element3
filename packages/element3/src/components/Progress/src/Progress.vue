<template>
  <div :class="['el-progress', 'el-progress--line', statusClass]">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer">
        <div class="el-progress-bar__inner" :style="barStyle"></div>
      </div>
    </div>
    <div class="el-progress__text">{{ content }}</div>
    <div data-testid="temptest" class="temptest">{{ '' }}</div>
  </div>
</template>

<script>
import { computed, defineComponent, isRef, toRefs } from 'vue'
import { isArray, isFunction, isString } from '../../../utils/types'
import { props, statusValid } from './props'

export default defineComponent({
  name: 'ElProgress',
  props,
  setup(props) {
    const { percentage, format, color, status } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const content = useContent(format, percentage)
    const statusClass = useStatusClass(status)
    return { barStyle, content, statusClass }
  }
})

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

const useBarStyle = (percentage, color) => {
  return computed(() => {
    const pv = autoFixPercentage(getRefValue(percentage))
    const cv = getRefValue(color)
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

const useContent = (format, percentage) => {
  return computed(() => {
    const fv = getRefValue(format)
    const pv = autoFixPercentage(getRefValue(percentage))
    if (typeof fv === 'function') {
      return fv(pv) || ''
    } else {
      return `${pv}%`
    }
  })
}

const useStatusClass = (status) => {
  return computed(() => {
    const st = getRefValue(status)
    return st && statusValid(st) ? `is-${st}` : ''
  })
}
</script>

<style></style>
