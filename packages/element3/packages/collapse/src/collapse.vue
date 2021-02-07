<!--
 * @Author: Mr Chang
 * @Date: 2020-09-21 01:09:39
 * @LastEditTime: 2020-09-21 15:00:28
 * @LastEditors: Mr Chang
 * @Description: 
 * @FilePath: \element3\packages\collapse\src\collapse.vue
-->
<template>
  <div class="el-collapse" role="tablist" aria-multiselectable="true">
    <slot></slot>
  </div>
</template>
<script>
import {
  getCurrentInstance,
  onBeforeMount,
  provide,
  reactive,
  toRefs,
  watch
} from 'vue'
import { useEmitter } from '../../../src/composables/emitter'

export default {
  name: 'ElCollapse',

  componentName: 'ElCollapse',

  props: {
    accordion: Boolean,
    modelValue: {
      type: [Array, String, Number],
      default() {
        return []
      }
    }
  },

  emits: ['update:modelValue', 'change'],

  setup(props, context) {
    const instance = getCurrentInstance()
    const state = reactive({
      activeNames: [].concat(props.modelValue)
    })

    provide('collapse', instance)

    const { on } = useEmitter()

    watch(
      () => props.modelValue,
      (value) => {
        state.activeNames = [].concat(value)
      }
    )

    onBeforeMount(() => {
      on('item-click', handleItemClick)
    })
    function setActiveNames(activeNames) {
      activeNames = [].concat(activeNames)
      const value = props.accordion ? activeNames[0] : activeNames
      state.activeNames = activeNames
      context.emit('update:modelValue', value)
      context.emit('change', value)
    }

    function handleItemClick(item) {
      const { name } = item
      if (props.accordion) {
        setActiveNames(
          (state.activeNames[0] || state.activeNames[0] === 0) &&
            state.activeNames[0] === name
            ? ''
            : name
        )
      } else {
        const activeNames = state.activeNames.slice(0)
        const index = activeNames.indexOf(name)

        if (index > -1) {
          activeNames.splice(index, 1)
        } else {
          activeNames.push(name)
        }
        setActiveNames(activeNames)
      }
    }
    return { ...toRefs(state), setActiveNames, handleItemClick }
  }
}
</script>
