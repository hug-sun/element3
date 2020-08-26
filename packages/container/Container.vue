<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
  name: 'ElContainer',
  componentName: 'ElContainer',
  props: {
    direction: String
  },
  setup(props, ctx) {
    const { direction } = toRefs(props)
    const isVertical = useIsVertical(direction, ctx.slots)
    return {
      isVertical
    }
  }
}

const useIsVertical = (direction, slots) => {
  const isVertical = computed(() => {
    if (direction === 'vertical') {
      return true
    } else if (direction === 'horizontal') {
      return false
    }
    return slots && slots.default
      ? slots.default().some((vnode) => {
          const tag = vnode.componentOptions && vnode.componentOptions.tag
          return tag === 'el-header' || tag === 'el-footer'
        })
      : false
  })

  return isVertical
}
</script>
