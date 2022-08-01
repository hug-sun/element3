<script lang="ts" setup>
import { computed, inject, withDefaults } from 'vue'

import { gridInjectionKey } from './config'

interface GridItemProps {
  offset?: number
}

// withDefaults 使用类型声明时的默认 props 值
const props = withDefaults(defineProps<GridItemProps>(), {
  offset: 0,
})

const {
  xGap,
  itemStyleRef,
  overflowRef,
} = inject(gridInjectionKey)!

const style = computed(() => {
  const gridColumn = 1 + props.offset

  return {
    gridColumn: `span ${gridColumn} / span ${gridColumn}`,
    marginLeft: props.offset > 0 ? `calc(((100% - ${xGap.value}px) / ${gridColumn}) * ${props.offset} + ${xGap.value}px)` : '',
  }
})
</script>

<template>
  <div class="el-grid-item" :style="[itemStyleRef, style]">
    <slot :overflow="overflowRef" />
  </div>
</template>

