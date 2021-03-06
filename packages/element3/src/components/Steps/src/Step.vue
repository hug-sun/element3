<template>
  <div class="el-step" data-testid="el-step">
    <div class="el-step__title">{{ title }}</div>
    <div class="el-step__description">{{ description }}</div>
    <div class="el-step__icon">
      <slot name="icon"><i :class="icon"></i></slot>
    </div>
    <div :class="'is-' + status"></div>
  </div>
</template>

<script>
import { inject, getCurrentInstance, ref } from 'vue'
export default {
  name: 'Step',
  props: {
    title: String,
    description: String,
    icon: String
  },
  setup() {
    useAddSelfToParent()
    const { status, changeStatus } = useChangeStatus()

    return {
      status,
      changeStatus
    }
  }
}

function useChangeStatus() {
  const status = ref('wait')
  const changeStatus = (val) => {
    status.value = val
  }

  return {
    status,
    changeStatus
  }
}

function useAddSelfToParent() {
  const { proxy } = getCurrentInstance()
  const steps = inject('steps', {})
  steps.add?.(proxy)
}
</script>

<style scoped></style>
