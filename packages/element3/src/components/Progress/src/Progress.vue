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
    <div class="el-progress-circle" v-else></div>
    <div class="el-progress__text" v-if="showText && !textInside">
      <template v-if="!status">{{ content }}</template>
      <i v-else :class="iconClass"></i>
    </div>
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
    const {
      percentage,
      format,
      color,
      strokeWidth,
      status,
      showText,
      textInside
    } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const barOuterStyle = useBarOuterStyle(strokeWidth)
    const content = useContent(format, percentage)
    const iconClass = useIconClass(status)
    const rootClass = useRootClass(status, showText, textInside)
    return { barStyle, barOuterStyle, content, iconClass, rootClass }
  }
})

const useRootClass = (status, showText, textInside) => {
  return computed(() => {
    const valStatus = getRefValue(status)
    const valShowText = getRefValue(showText)
    const valTextInside = getRefValue(textInside)
    const statusClass =
      valStatus && statusValid(valStatus) ? `is-${valStatus}` : ''
    return [
      'el-progress',
      'el-progress--line',
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

const useBarOuterStyle = (strokeWidth) => {
  return computed(() => {
    const sw = getRefValue(strokeWidth)
    return { height: sw + 'px' }
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

const useIconClass = (status) => {
  return computed(() => {
    const st = getRefValue(status)
    return STATUS_SETTING[st] || ''
  })
}
</script>

<style></style>
