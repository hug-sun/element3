<template>
  <div class="el-tree" role="Tree">
    <el-tree-node v-for="child in rootChildren" :node="child" :key="child.id">
    </el-tree-node>
    <div class="el-tree__empty-block" v-if="tree.isEmpty">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  getCurrentInstance,
  PropType,
  provide,
  watchEffect
} from 'vue'
import { t } from '../../../locale'
import ElTreeNode from './TreeNode.vue'
import { Tree } from './entity/Tree'
import { AsyncLoader, ID } from './entity/TreeNode'
import { DefaultNodeKey, RawNodeBase } from './types'
export default {
  name: 'ElTreeMain',
  components: { ElTreeNode },
  props: {
    modelValue: { type: Array, default: () => [] },
    emptyText: { type: String, default: () => t('el.tree.emptyText') },
    defaultNodeKey: Object as PropType<DefaultNodeKey<RawNodeBase>>,
    indent: { type: Number, default: 18 },

    checked: { type: Array as PropType<ID[]>, default: () => [] },
    showCheckbox: Boolean,
    checkOnClickNode: Boolean,
    checkStrictly: Boolean,

    iconClass: { type: String, default: 'el-icon-caret-right' },
    renderAfterExpand: { type: Boolean, default: true },
    accordion: Boolean,
    autoExpandParent: { type: Boolean, default: true },
    expandOnClickNode: { type: Boolean, default: true },
    expanded: { type: Array as PropType<ID[]>, default: () => [] },
    defaultExpandAll: Boolean,

    async: Boolean,
    asyncLoader: Function as PropType<AsyncLoader>,

    renderContent: Function
  },
  emits: ['update:modelValue', 'update:checked', 'update:expanded'],
  setup(props, ctx) {
    const elTree = getCurrentInstance().proxy
    provide('elTree', elTree)
    const tree = new Tree(props.modelValue, props.defaultNodeKey)
    ctx.emit('update:modelValue', tree.rawNodesProxy)
    const rootChildren = computed(() => tree.rootProxy.children)

    watchEffect(
      () => {
        tree.expandNodeByIds(props.expanded)
      },
      {
        flush: 'post'
        // exec after wait component flush
      }
    )
    watchEffect(() => {
      ctx.emit('update:expanded', tree.getExpandedNodeIds())
    })

    if (props.async) tree.bindAsyncLoader(props.asyncLoader)

    tree.setStrictly(props.checkStrictly)
    watchEffect(
      () => {
        tree.setCheckedByIds(props.checked)
      },
      {
        flush: 'post'
        // exec after wait component flush
      }
    )
    watchEffect(() => {
      ctx.emit('update:checked', tree.getCheckedIds())
    })

    if (props.defaultExpandAll) tree.expandAll(true)

    return {
      tree,
      rootChildren
    }
  }
}
</script>
