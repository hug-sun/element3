<template>
  <div :class="['el-progress', 'el-progress--line', statusClass]">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer">
        <div class="el-progress-bar__inner" :style="barStyle"></div>
      </div>
    </div>
    <div class="el-progress__text" v-if="showText">
      <template v-if="!status">{{ content }}</template>
      <i v-else :class="iconClass"></i>
    </div>
    <div data-testid="temptest" class="temptest">{{ '' }}</div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue'
import { isArray, isFunction, isString } from '../../../utils/types'
import {
  props,
  statusValid,
  autoFixPercentage,
  getRefValue,
  toPercentageColors,
  sortByPercentage,
  getColorsIndex,
  STATUS_SETTING
} from './props'

export default defineComponent({
  name: 'ElProgress',
  props,
  setup(props) {
    const { percentage, format, color, status } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const content = useContent(format, percentage)
    const statusClass = useStatusClass(status)
    const iconClass = useIconClass(status)
    return { barStyle, content, statusClass, iconClass }
  }
})

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

const useIconClass = (status) => {
  return computed(() => {
    const st = getRefValue(status)
    return STATUS_SETTING[st] || ''
  })
}
</script>

<style></style>
