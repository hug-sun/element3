<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { computed, getCurrentInstance, toRefs, unref, withDefaults } from 'vue'
interface ColType {
  span?: number
  tag?: string
  offset?: number
  pull?: number
  push?: number
  xs?: number | object
  sm?: number | object
  md?: number | object
  lg?: number | object
  xl?: number | object
}

interface StyleType {
  paddingLeft?: string
  paddingRight?: string
}

const props = withDefaults(defineProps<ColType>(), {
  span: 24,
  tag: 'div',
})

const { tag } = toRefs<ColType>(props)
// const slots = useSlots()
const gutter = computed<number>(() => {
  let { parent }: ComponentInternalInstance = getCurrentInstance()
  while (parent && parent?.type?.name !== 'ElRow')
    parent = parent.parent

  return (parent ? parent.props.gutter : 0) as number
})

function useClassesAndStyle(props: ColType) {
  const classList = ['el-col']
  const style: StyleType = {}
  if (unref<number>(gutter)) {
    style.paddingLeft = `${unref<number>(gutter) / 2}px`
    style.paddingRight = style.paddingLeft
  }

  const spanValue = unref(toRefs(props).span) || 0
  if (spanValue)
    classList.push(`el-col-${spanValue}`);

  ['offset', 'pull', 'push'].forEach((prop) => {
    const value = unref(toRefs(props)[prop]) as number || 0
    if (value)
      classList.push(`el-col-${prop}-${value}`)
  });

  ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
    const result: number | object = unref(toRefs(props)[size])
    const typeName = typeof result
    switch (typeName) {
      case 'number':
        classList.push(`el-col-${size}-${result}`)
        break
      case 'object':
        Object.keys(result).forEach((prop) => {
          if (prop === 'span') {
            classList.push(`el-col-${size}-${result[prop]}`)
            return
          }
          classList.push(`el-col-${size}-${prop}-${result[prop]}`)
        })
    }
  })

  return [classList.join(' '), style]
}

const [classes, style] = useClassesAndStyle(props)
</script>

<script lang="ts">
export default {
  name: 'ElCol',
}
</script>

<template>
  <component :is="unref(tag)" :class="classes" :style="style">
    <slot />
  </component>
</template>

<style lang="scss">
@import '../../../../theme/src/col.scss';
</style>
