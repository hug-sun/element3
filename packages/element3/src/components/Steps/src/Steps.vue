<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStepList } from './stepList'
import { onMounted, provide, toRefs, watchEffect } from 'vue'

export default {
  name: 'Steps',
  props: {
    active: {
      default: 0
    },
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },
  setup(props) {
    //响应式对象
    const { active } = toRefs(props)

    const stepStatusConfig = computed(() => {
      return {
        finish: props.finishStatus,
        process: props.processStatus
      }
    })

    const { stepList } = useStepList(stepStatusConfig)

    useStepsProvide(stepList)
    useChangeStepStatus(active, stepList)
  }
}

function useStepsProvide(stepList) {
  function createStepsProvide() {
    return {
      add(stepProxy) {
        stepList.add(stepProxy)
      }
    }
  }

  provide('steps', createStepsProvide())
}

function useChangeStepStatus(active, stepList) {
  onMounted(() => {
    watchEffect(() => {
      stepList.changeStatus(active)
    })
  })
}
</script>

<style scoped></style>
