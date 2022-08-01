<script lang="ts" setup>
import { computed, provide, ref, toRef, withDefaults } from 'vue'
import type { CSSProperties, Ref } from 'vue'

import { gridInjectionKey } from './config'

export interface ElGridInjection {
  // isSsrRef: Ref<boolean>
  itemStyleRef: Ref<CSSProperties | string | undefined>
  xGap: Ref<string | undefined>
  overflowRef: Ref<boolean>
}

export interface GridProps {
  cols?: string | number
  xGap?: string | number
  yGap?: string | number
  itemStyle?: object | string
}

// withDefaults 使用类型声明时的默认 props 值
// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<GridProps>(), {
  cols: 24,
  xGap: 0,
  yGap: 0,
})

const overflowRef = ref(false)

provide(gridInjectionKey, {
  itemStyleRef: toRef(props, 'itemStyle'),
  xGap: toRef(props, 'xGap'),
  overflowRef,
})

function useStyle(props: GridProps) {
  return computed(() => {
    return {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: `repeat(${props.cols}, minmax(0px, 1fr))`,
      columnGap: `${props.xGap}px`,
      rowGap: `${props.yGap}px`,
    }
  })
}
const gridStyle = useStyle(props)
</script>

<template>
  <div class="el-grid" :style="gridStyle">
    <slot />
  </div>
</template>
