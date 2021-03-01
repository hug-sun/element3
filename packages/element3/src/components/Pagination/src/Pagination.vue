<template>
  <div v-if="pager.count > 1" class="el-pagination">
    <template v-for="(part, index) in layoutPart" :key="index">
      <component :is="part" :pager="pager"></component>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch,
  watchEffect,
  Ref
} from 'vue'
import { ElPaginationProps } from '../types'
import { Pager as PagerCore } from './entity/Pager'
import { parseLayout } from './tools/parseLayout'

import Pager from './parts/Pager.vue'
import Prev from './parts/Prev.vue'
import Next from './parts/Next.vue'
import Total from './parts/Total.vue'

export default defineComponent({
  name: 'ElPagination',
  props: {
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, total'
    },
    pagerCount: {
      type: Number,
      default: 7
    },

    currentPage: {
      type: Number,
      default: 1
    },
    pageCount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number
    },
    pageSize: {
      type: Number,
      default: 1
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Pager,
    Prev,
    Next,
    Total
  },
  setup(props: ElPaginationProps) {
    const {
      currentPage,
      total,
      pageSize,
      pagerCount,
      pageCount,
      layout
    } = toRefs(props)
    const { layoutPart } = useLayout(layout)
    const { pager } = usePager({
      currentPage,
      total,
      pageSize,
      pagerCount,
      pageCount
    })

    return {
      layoutPart,
      pager
    }
  }
})

function usePager({ total, pageCount, pageSize, pagerCount, currentPage }) {
  const pager = reactive(
    new PagerCore({
      total: total?.value ?? pageCount.value,
      size: pageSize.value,
      viewCount: pagerCount.value,
      current: currentPage.value
    })
  )
  return { pager }
}

function useLayout(layout: Ref<string>) {
  const layoutPart = computed(() => parseLayout(layout.value))
  return {
    layoutPart
  }
}
</script>
