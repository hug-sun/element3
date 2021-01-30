<template>
  <div
    class="el-tree-node"
    :class="{
      'is-checked': node.isChecked
    }"
    role="TreeNode"
    :aria-checked="node.isChecked"
    tabindex="-1"
    :id="'TreeNode' + node.id"
    :data-node-id="node.id"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': node.level * elTree.indent + 'px' }"
    >
      <el-checkbox
        v-if="elTree.showCheckbox"
        :modelValue="node.isChecked"
        :indeterminate="node.isIndeterminate"
        :disabled="node.isDisabled"
        @update:modelValue="node.setChecked($event)"
      >
      </el-checkbox>
      <span
        v-if="node.asyncState === 'loading'"
        class="el-tree-node__loading-icon el-icon-loading"
      ></span>
      <el-node-content
        class="el-tree-node__label"
        :node="node"
      ></el-node-content>
    </div>
    <el-collapse-transition>
      <div class="el-tree-node__children" role="group">
        <el-tree-node
          v-for="child in node.children"
          :key="child.id"
          :node="child"
        >
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import ElCollapseTransition from '../../../transitions/collapse-transition'
import ElNodeContent from './NodeContent.vue'
import { TreeNode } from './entity/TreeNode'
import { inject } from 'vue'
export default {
  name: 'ElTreeNode',

  components: {
    ElCollapseTransition,
    ElNodeContent
  },

  props: {
    node: TreeNode
  },

  setup() {
    const elTree = inject('elTree', { indent: 10 })
    return {
      elTree
    }
  }
}
</script>
