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

export default defineComponent({
  name: 'ElProgress',
  props: { percentage: Number, format: Function },
  setup(props) {
    const { percentage, format } = toRefs(props)
    const barStyle = useBarStyle(percentage)
    const content = useContent(format, percentage)
    return { barStyle, content }
  }
})

const useBarStyle = (percentage) => {
  return computed(() => {
    return { width: `${percentage.value}%` }
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
