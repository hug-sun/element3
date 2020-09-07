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
import { provide, reactive, toRefs, watch, onMounted } from 'vue'

// import Migrating from 'element-ui/src/mixins/migrating'
import { stateSymbol, propsSymbol } from './constants'

export default {
  name: 'ElSteps',

  // mixins: [Migrating],

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
  events: ['change'],
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
      (steps) => {
        state.steps.forEach((child, index) => {
          child.state.index = index
        })
      },
      {
        deep: true
      }
    )

    function getMigratingConfig() {
      return {
        props: {
          center: 'center is removed.'
        }
      }
    }

    onMounted(() => {
      // console.log(state.steps)
    })
    return { ...toRefs(state), getMigratingConfig }
  }
}
</script>
