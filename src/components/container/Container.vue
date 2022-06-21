<script setup lang="ts">
import { computed, toRefs, useSlots, withDefaults } from 'vue'
import { DirectionEnum } from './DirectionEnum'
const props = withDefaults(defineProps<ContainerType>(), {
  direction: DirectionEnum.horizontal,
})

interface ContainerType {
  direction?: DirectionEnum.horizontal | DirectionEnum.vertical
}
function useClasses(props) {
  // const { direction } = toRefs<ContainerType>(props)
  const slots = useSlots()

  return computed(() => {
    let isVertical = false
    if (slots && slots.default) {
      isVertical = slots.default().some((vNode) => {
        const tag = vNode.type && vNode.type.name
        return ['ElHeader', 'ElFooter'].includes(tag)
      })

      // return slots.default().reduce((prev, cur) => {
      //   prev += '&&' + JSON.stringify(cur.type?.name)
      //   return prev
      // }, '')
    }

    if (isVertical)
      return 'is-vertical'

    if (props.direction === DirectionEnum.vertical)
      return 'is-vertical'
    if (props.direction === DirectionEnum.horizontal)
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
