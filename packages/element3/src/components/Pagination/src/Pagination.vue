<template>
  <div v-if="!(hideOnSinglePage && pager.count <= 1)" class="el-pagination">
    <layout-part :layout-parts="layoutParts"></layout-part>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch,
  Ref,
  getCurrentInstance,
  PropType,
  watchEffect,
  provide
} from 'vue'
import { ElPaginationProps } from '../types'
import { Pager as PagerCore, PagerEventType } from './entity/Pager'
import { parseLayout } from './tools/parseLayout'

import LayoutPart from './Layout.vue'

export default defineComponent({
  name: 'ElPagination',
  props: {
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, ->, total'
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
      type: Number
    },
    total: {
      type: Number
    },
    pageSize: {
      type: Number,
      default: 10
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array as PropType<number[]>,
      default: [10, 50, 100]
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  emits: [
    'update:currentPage',
    'prev-click',
    'next-click',
    'size-change',
    'update:pageSize'
  ],
  components: {
    LayoutPart
  },
  setup(props: ElPaginationProps) {
    const {
      currentPage,
      total,
      pageSize,
      pagerCount,
      pageCount,
      pageSizes,
      popperClass,
      layout
    } = toRefs(props)
    const { layoutParts } = useLayout(layout)
    const { pager } = usePager({
      currentPage,
      total,
      pageSize,
      pagerCount,
      pageCount
    })
    useSises({ pager, pageSizes })
    useStyle({ pager, popperClass })

    return {
      pager,
      layoutParts
    }
  }
})

function usePager({ total, pageCount, pageSize, pagerCount, currentPage }) {
  const pagerEventHandler = (pager) => {
    pager.on(PagerEventType.CHANGE, (v) => {
      emit('update:currentPage', v)
    })
    pager.on(PagerEventType.PREV, (v) => {
      emit('prev-click', v)
    })
    pager.on(PagerEventType.NEXT, (v) => {
      emit('next-click', v)
    })
    pager.on(PagerEventType.SIZE_CHANGE, (v) => {
      emit('size-change', v)
      emit('update:pageSize', v)
    })
  }
  const bindVariableHandler = (pager) => {
    if (total)
      watch(total, (v: number) => {
        pager.total = v
      })
    if (pageCount)
      watch(pageCount, (v: number) => {
        pager.total = v
        pager.changeSize(1)
      })
    watch(pagerCount, (v: number) => {
      pager.viewCount = v
    })
    watch(pageSize, (v: number) => {
      pager.size = v
    })
    watch(currentPage, (v: number) => {
      pager.current = v
    })
  }

  const { emit } = getCurrentInstance()

  const pager = reactive(
    new PagerCore({
      total: total?.value ?? pageCount.value,
      size: total?.value ? pageSize.value : 1,
      viewCount: pagerCount.value,
      current: currentPage.value
    })
  )

  pagerEventHandler(pager)
  bindVariableHandler(pager)

  provide('pagination/pager', pager)

  return { pager }
}

function useStyle({ pager, popperClass }) {
  watchEffect(() => {
    pager.style = {
      popperClass: popperClass.value
    }
  })
}

function useSises({ pager, pageSizes }) {
  watchEffect(() => {
    pager.sizes = pageSizes.value
  })
}

function useLayout(layout: Ref<string>) {
  const instance = getCurrentInstance()
  const layoutParts = computed(() => parseLayout(layout.value))
  provide('pagination/slot/default', instance.slots.default)
  return {
    layoutParts
  }
}
</script>
