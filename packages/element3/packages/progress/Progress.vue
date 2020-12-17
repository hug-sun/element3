<template>
  <div class="el-progress el-progress--line">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer">
        <div class="el-progress-bar__inner" :style="barStyle"></div>
      </div>
    </div>
    <div class="el-progress__text">{{ percentage }}%</div>
    <div data-testid="temptest" class="temptest">{{ '' }}</div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'ElProgress',
  props: { percentage: Number },
  setup(props) {
    const { percentage } = toRefs(props)
    const barStyle = useBarStyle(percentage)
    return { barStyle }
  }
})

const useBarStyle = (percentage) => {
  return computed(() => {
    return { width: `${percentage.value}%` }
  })
}
</script>

<style></style>
