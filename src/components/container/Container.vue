<script setup lang="ts">
import type { Component, VNode } from 'vue'
import { computed, toRefs, useSlots, withDefaults } from 'vue'
import { DirectionEnum } from './DirectionEnum'
const props = withDefaults(defineProps<ContainerType>(), {
  direction: DirectionEnum.horizontal,
})

interface ContainerType {
  direction?: DirectionEnum.horizontal | DirectionEnum.vertical
}
function useClasses(props) {
  const { direction } = toRefs<ContainerType>(props)
  const slots = useSlots()

  return computed(() => {
    let isVertical = false
    if (slots && slots.default) {
      const vNodes: Array<VNode> = slots.default()
      isVertical = vNodes.some((vNode) => {
        const component = vNode.type as Component
        return ['ElHeader', 'ElFooter'].includes(component.name)
      })
    }

    if (isVertical)
      return 'is-vertical'

    if (direction.value === DirectionEnum.vertical)
      return 'is-vertical'
    if (direction.value === DirectionEnum.horizontal)
      return ''

    return ''
  })
}

const classes = useClasses(props)
</script>

<template>
  <section class="el-container" :class="classes">
    <slot />
  </section>
</template>

<style lang="scss">
@import '../../theme/src/container.scss';
</style>
