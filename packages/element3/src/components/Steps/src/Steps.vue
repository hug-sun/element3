<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { provide, ref, onMounted } from 'vue'
export default {
  name: 'Steps',
  props: {
    active: {
      default: 0
    }
  },
  setup(props) {
    //响应式对象
    const stepList = ref([])

    provide('steps', {
      add(step) {
        stepList.value.push(step)
      }
    })

    onMounted(() => {
      stepList.value.forEach((stepProxy, index) => {
        if (index < props.active) {
          stepProxy.changeStatus('success')
          return
        }
        if (index === props.active) {
          stepProxy.changeStatus('process')
        }
      })
    })
  }
}
</script>

<style scoped></style>
