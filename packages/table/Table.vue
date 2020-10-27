<template>
  <div class="el-table">
    <div class="hidden-columns"><slot></slot></div>
    <div class="el-table__header-wrapper" v-if="showHeader">
      <table-header />
    </div>
    <div class="el-table__body-wrapper">
      <table-body />
      <div class="el-table__empty-block" v-if="!data || data.length === 0">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div class="el-table__append-wrapper" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </div>
    <div class="el-table__footer-wrapper" v-if="showSummary" v-show="data && data.length > 0">
      <table-footer :store="store" />
    </div>
    <div class="el-table__fixed" v-if="fixedColumns.length">
      <div class="el-table__fixed-header-wrapper" v-if="showHeader">
        <table-header fixed="left" />
      </div>
      <div class="el-table__fixed-body-wrapper">
        <table-body fixed="left" />
        <div class="el-table__append-gutter" v-if="$slots.append"></div>
      </div>
      <div class="el-table__fixed-footer-wrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer fixed="left" />
      </div>
    </div>
    <div class="el-table__fixed-right" v-if="fixedRightColumns.length">
      <div class="el-table__fixed-header-wrapper" v-if="showHeader">
        <table-header fixed="right" />
      </div>
      <div class="el-table__fixed-body-wrapper">
        <table-body fixed="right" />
        <div class="el-table__append-gutter" v-if="$slots.append"></div>
      </div>
      <div class="el-table__fixed-footer-wrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer fixed="right" />
      </div>
    </div>
    <div class="el-table__fixed-right-patch" v-if="fixedRightColumns.length"></div>
    <div class="el-table__column-resize-proxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script>
import TableBody from './TableBody.vue'
import TableHeader from './TableHeader.vue'
import TableFooter from './TableFooter.vue'
import useTableState from './useTableState'
import { computed, Fragment, reactive } from 'vue'

export default {
  components: {
    TableHeader,
    TableBody,
    TableFooter
  },

  name: 'ElTable',

  props: {
    data: { type: Array, default: () => [] },
    size: String,
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: { type: Boolean, default: true },
    stripe: Boolean,
    border: Boolean,
    rowKey: [String, Function],
    showHeader: { type: Boolean, default: true },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    spanMethod: Function,
    selectOnIndeterminate: { type: Boolean, default: true },
    indent: { type: Number, default: 16 },
    treeProps: { type: Object, default: () => ({ hasChildren: 'hasChildren', children: 'children' }) },
    lazy: Boolean,
    load: Function
  },

  setup(props, context) {
    const state = reactive({})
    context.slots.default

    state.fixedRightColumns = computed(() => 0)
    state.fixedColumns = computed(() => 0)

    state.props = computed(() => props)
    state.data = computed(() => props.data)
    state.rawColumns = computed(() => {
      const slot = context.slots.default
      return slot ? slot() : []
    })
    state.columns = computed(() => {
      const array = state.rawColumns.concat()
      for (let i = 0; i < array.length; ) {
        if (array[i].type === Fragment) {
          array.splice(i, 1, ...array[i].children)
        } else {
          i++
        }
      }
      return array
    })

    useTableState(state)

    return state
  }
}
</script>
