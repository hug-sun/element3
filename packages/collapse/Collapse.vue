<template>
  <div class="el-collapse" role="tablist" aria-multiselectable="true">
    <slot></slot>
  </div>
</template>
<script>
import { ref, watch, provide, onUnmounted } from 'vue'
import { useEmitter } from 'element-ui/src/use/emitter'
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
  emits: ['collapse-item-click', 'update:modelValue'],
  setup(props, { emit }) {
    const { on, off } = useEmitter()
    const initValue = [].concat(props.modelValue)
    const activeNames = ref(initValue)
    watch(
      () => props.modelValue,
      () => {
        activeNames.value = [].concat(props.modelValue)
      }
    )

    const setActiveNames = (names) => {
      activeNames.value = [].concat(names)
      const value = props.accordion ? activeNames.value[0] : activeNames.value
      emit('update:modelValue', value)
    }

    const handleItemClick = (name) => {
      if (props.accordion) {
        const currentName =
          (activeNames.value[0] || activeNames.value[0] === 0) &&
          activeNames.value[0] === name
            ? []
            : [name]
        setActiveNames(currentName)
      } else {
        const currentName = activeNames.value.slice(0)
        const index = currentName.indexOf(name)

        if (index > -1) {
          currentName.splice(index, 1)
        } else {
          currentName.push(name)
        }
        setActiveNames(currentName)
      }
    }

    provide('activeNames', activeNames)
    on('collapse-item-click', handleItemClick)

    onUnmounted(() => {
      off('collapse-item-click', handleItemClick)
    })

    return { setActiveNames }
  }
}
</script>
