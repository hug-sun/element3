<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script>
import { computed, toRefs } from 'vue'
export default {
  name: 'ElContainer',
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    }
  },
  setup(props, { slots }) {
    const { direction } = toRefs(props)

    const isVertical = computed(() => {
      if (direction === 'vertical') {
        return true
      } else if (direction === 'horizontal') {
        return false
      }
      if (slots && slots.default) {
        return slots.default().some((vNode) => {
          const tag = vNode.type && vNode.type.name
          return tag === 'ElHeader' || tag === 'ElFooter'
        })
      } else {
        return false
      }
    })
    return {
      isVertical
    }
  }
}
</script>
