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
import { computed, getCurrentInstance, provide } from 'vue'
import { t } from '../../../locale'
import ElTreeNode from './TreeNode.vue'
import { Tree } from './entity/Tree'
export default {
  name: 'ElTreeMain',
  components: { ElTreeNode },
  props: {
    modelValue: { type: Array, default: () => [] },
    emptyText: { type: String, default: () => t('el.tree.emptyText') },
    defaultNodeKey: Object,
    indent: { type: Number, default: 18 }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const elTree = getCurrentInstance().proxy
    provide('elTree', elTree)
    const tree = new Tree(props.modelValue, props.defaultNodeKey)
    ctx.emit('update:modelValue', tree.rawNodesProxy)
    const rootChildren = computed(() => tree.root.children)

    return {
      tree,
      rootChildren
    }
  }
}
</script>
