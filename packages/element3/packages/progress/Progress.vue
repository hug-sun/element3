<template>
  <div class="el-progress el-progress--line">
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
import { isArray, isFunction, isString } from '../../src/utils/types'

export default defineComponent({
  name: 'ElProgress',
  props: {
    percentage: Number,
    format: Function,
    color: { type: [String, Function, Array], default: '' }
  },
  setup(props) {
    const { percentage, format, color } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const content = useContent(format, percentage)
    return { barStyle, content }
  }
})

export function getColorsIndex(colors, percent) {
  const n = colors.length
  for (let i = 0; i < colors.length; i++) {
    if (percent < colors[i].percentage) {
      return i
    }
  }
  return n - 1
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

const useBarStyle = (percentage, color) => {
  return computed(() => {
    const pv = getRefValue(percentage)
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
    const pv = getRefValue(percentage)
    if (typeof fv === 'function') {
      return fv(pv) || ''
    } else {
      return `${pv}%`
    }
  })
}
</script>

<style></style>
