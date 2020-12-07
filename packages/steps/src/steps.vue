<!--
 * @Author: Mr Chang
 * @Date: 2020-08-28 17:50:21
 * @LastEditTime: 2020-08-31 01:54:48
 * @LastEditors: Mr Chang
 * @Description: 
 * @FilePath: \element3\packages\steps\src\steps.vue
-->
<template>
  <div
    class="el-steps"
    :class="[!simple && 'el-steps--' + direction, simple && 'el-steps--simple']"
  >
    <slot></slot>
  </div>
</template>

<script>
import { provide, reactive, toRefs, watch } from 'vue'

import { stateSymbol, propsSymbol } from './constants'

export default {
  name: 'ElSteps',
  props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },
  emits: ['change'],
  setup(props, context) {
    const state = reactive({
      steps: [],
      stepOffset: 0
    })

    provide(stateSymbol, state)
    provide(propsSymbol, props)

    watch(
      () => props.active,
      (newVal, oldVal) => context.emit('change', newVal, oldVal)
    )
    watch(
      () => state.steps,
      () => {
        state.steps.forEach((child, index) => {
          child.state.index = index
        })
      },
      {
        deep: true
      }
    )

    return { ...toRefs(state) }
  }
}
</script>
