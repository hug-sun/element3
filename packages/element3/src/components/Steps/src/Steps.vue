<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { provide, ref, onMounted, toRefs } from 'vue'
export default {
  name: 'Steps',
  props: {
    active: {
      default: 0
    }
  },
  setup(props) {
    //响应式对象
    const { active } = toRefs(props)
    const stepList = ref([])

    useStepsProvide(stepList)
    useChangeStepStatus(stepList, active)
  }
}

function useStepsProvide(stepList) {
  function createStepsProvide() {
    return {
      add(stepProxy) {
        stepList.value.push(stepProxy)
      }
    }
  }

  provide('steps', createStepsProvide())
}

function useChangeStepStatus(stepList, active) {
  function changeStepStatus() {
    stepList.value.forEach((stepProxy, index) => {
      if (index < active.value) {
        stepProxy.changeStatus('success')
        return
      }
      if (index === active.value) {
        stepProxy.changeStatus('process')
      }
    })
  }

  onMounted(() => changeStepStatus())
}
</script>

<style scoped></style>
