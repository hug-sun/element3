<template>
  <el-transfer v-model="value" :data="data"></el-transfer>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  setup() {
    const state = reactive({
      data: generateData(),
      value: [1, 4]
    })
    return toRefs(state)
  }
}
const generateData = _ => {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${ i }`,
      disabled: i % 4 === 0
    })
  }
  return data
}
</script>