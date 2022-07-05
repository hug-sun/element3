<script setup lang="ts">
import { computed, getCurrentInstance, provide, toRefs, unref, withDefaults } from 'vue'

interface RowType {
  tag?: string
  gutter?: number
  type?: string
  justify?: string
  align?: string
}

interface StyleType {
  marginLeft?: string
  marginRight?: string
}

const props = withDefaults(defineProps<RowType>(), {
  tag: 'div',
  gutter: 0,
  justify: 'start',
  align: 'top',
})

const { tag } = toRefs<RowType>(props)

function useClassesAndStyle(props: RowType) {
  const classList = ['el-row']
  const style = computed<StyleType>(() => {
    const result: StyleType = {}
    const gutter = unref<number>(props.gutter)
    if (gutter) {
      result.marginLeft = `-${gutter / 2}px`
      result.marginRight = result.marginLeft
    }
    return result
  })

  const { justify, align, type: typeName } = props

  if (unref(justify) !== 'start')
    classList.push(`is-justify-${unref(justify)}`)

  if (unref(align) !== 'top')
    classList.push(`is-align-${unref(align)}`)

  if (unref(typeName) === 'flex')
    classList.push('el-row--flex')

  provide('el-row', getCurrentInstance())
  return [classList.join(' '), unref(style)]
}

const [classes, style] = useClassesAndStyle(props)
</script>

<script lang="ts">
export default {
  name: 'ElRow',
}
</script>

<template>
  <component :is="unref(tag)" :class="classes" :style="style">
    <slot />
  </component>
</template>

<style lang="scss">
@import '../../../../theme/src/row.scss';
</style>

