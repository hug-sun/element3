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
import { computed, defineComponent, toRefs } from 'vue'
import { isFunction, isString } from '../../src/utils/types'

export default defineComponent({
  name: 'ElProgress',
  props: {
    percentage: Number,
    format: Function,
    color: { type: [String, Function], default: '' }
  },
  setup(props) {
    const { percentage, format, color } = toRefs(props)
    const barStyle = useBarStyle(percentage, color)
    const content = useContent(format, percentage)
    return { barStyle, content }
  }
})

const useBarStyle = (percentage, color) => {
  return computed(() => {
    const style = { width: `${percentage.value}%` }
    if (color && isFunction(color.value)) {
      style.backgroundColor = color.value(percentage.value)
    }
    if (color && isString(color.value)) {
      style.backgroundColor = color.value
    }
    return style
  })
}

const useContent = (format, percentage) => {
  return computed(() => {
    if (format && typeof format.value === 'function') {
      return format.value(percentage.value) || ''
    } else {
      return `${percentage.value}%`
    }
  })
}
</script>

<style></style>
