<template>
  <div class="el-pagination">
    <template v-for="(part, index) in layoutPart" :key="index">
      <component :is="part" :pager="pager"></component>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { ElPaginationProps } from '../types'
import { Pager as PagerCore } from './entity/Pager'
import { parseLayout } from './tools/parseLayout'

import Pager from './parts/Pager.vue'
import Prev from './parts/Prev.vue'
import Next from './parts/Next.vue'

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
    }
  },
  components: {
    Pager,
    Prev,
    Next
  },
  setup(props: ElPaginationProps) {
    const layoutPart = computed(() => parseLayout(props.layout))
    const pager = new PagerCore(
      props.pageCount,
      props.currentPage,
      props.pagerCount
    )
    console.log(pager)
    return {
      layoutPart,
      pager
    }
  }
})
</script>

<style></style>
