<template>
  <div
    v-show="node.isVisible"
    class="el-tree-node"
    :class="{
      'is-checked': node.isChecked,
      'is-focusable': !node.isDisabled,
      'is-expanded': node.isExpanded,
      'is-hidden': !node.isVisible
    }"
    role="TreeNode"
    :aria-expanded="node.isExpanded"
    :aria-disabled="node.isDisabled"
    :aria-checked="node.isChecked"
    :aria-visible="node.isVisible"
    tabindex="-1"
    :id="'TreeNode' + node.id"
    :data-node-id="node.id"
    @click.stop="onClickTreeNode"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * elTree.indent + 'px' }"
      @click="onClickTreeNodeContent"
    >
      <span
        :class="[
          { expanded: node.isExpanded, 'is-leaf': node.isLeaf },
          'el-tree-node__expand-icon',
          elTree.iconClass
        ]"
        @click.stop="onClickTreeNodeExpand"
      >
      </span>
      <el-checkbox
        v-if="elTree.showCheckbox"
        :modelValue="node.isChecked"
        :indeterminate="node.isIndeterminate"
        :disabled="node.isDisabled"
        @click.prevent.stop="onClickCheckbox"
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
      <div
        v-show="node.isExpanded"
        v-if="!elTree.renderAfterExpand || node.isRendered"
        class="el-tree-node__children"
        role="group"
        :aria-expanded="node.isExpanded"
      >
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
import { ElCheckbox } from '../../../index'
import { TreeNode } from './entity/TreeNode'
import { inject } from 'vue'
export default {
  name: 'ElTreeNode',

  components: {
    ElCollapseTransition,
    ElNodeContent,
    ElCheckbox
  },

  props: {
    node: TreeNode
  },

  setup(props) {
    const elTree = inject('elTree', {
      indent: 10,
      checkOnClickNode: false,
      accordion: false,
      autoExpandParent: true,
      expandOnClickNode: true
    })
    const onClickTreeNodeContent = () => {
      if (!elTree.checkOnClickNode) {
        return
      }
      props.node.setChecked()
    }
    const onClickCheckbox = () => {
      if (elTree.checkOnClickNode) {
        return
      }
      props.node.setChecked()
    }
    const onClickTreeNodeExpand = () => {
      if (elTree.accordion) props.node.collapse()
      else props.node.expand(undefined, elTree.autoExpandParent)
    }
    const onClickTreeNode = () => {
      if (elTree.expandOnClickNode) {
        onClickTreeNodeExpand()
      }
    }
    return {
      elTree,
      onClickCheckbox,
      onClickTreeNodeContent,
      onClickTreeNode,
      onClickTreeNodeExpand
    }
  }
}
</script>
