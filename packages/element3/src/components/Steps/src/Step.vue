<template>
  <div class="el-step" data-testid="el-step">
    <div class="el-step__title">{{ title }}</div>
    <div :class="'is-' + status"></div>
  </div>
</template>

<script>
import { inject, getCurrentInstance, ref } from 'vue'
export default {
  name: 'Step',
  props: {
    title: String
  },
  setup() {
    // api
    // changeStatus
    // vue provide/inject
    const { proxy } = getCurrentInstance()
    const steps = inject('steps', {})
    steps.add?.(proxy)

    const status = ref('wait')
    const changeStatus = (val) => {
      status.value = val
    }

    return {
      status,
      changeStatus
    }
  }
}
</script>

<style scoped></style>
