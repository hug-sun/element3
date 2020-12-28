<template>
  <div
    v-show="node.isVisable"
    class="el-tree-node"
    :class="{
      'is-expanded': node.isExpanded,
      'is-current': elTree.proxy.dragState.current === node,
      'is-hidden': !node.isVisable,
      'is-focusable': !node.isDisabled,
      'is-checked': node.isChecked,
      'is-drop-inner':
        elTree.proxy.dragState.drop === 'inner' &&
        elTree.proxy.dragState.current === node
    }"
    role="TreeNode"
    tabindex="-1"
    ref="TreeNode"
    :id="'TreeNode' + node.id"
    :aria-expanded="node.isExpanded"
    :aria-disabled="node.isDisabled"
    :aria-checked="node.isChecked"
    :draggable="elTree.props.draggable || node.isDraggable"
    :data-node-id="node.id"
    @click.right.stop="onRightEvent"
    @click.stop="onClickNode"
    @dragstart.stop="elTree.proxy.handleDragStart(node, $event)"
    @dragover.stop="elTree.proxy.handleDragOver(node, $event)"
    @dragend.stop="elTree.proxy.handleDragEnd(node, $event)"
    @drop.stop="elTree.proxy.handleDrop(node, $event)"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * elTree.props.indent + 'px' }"
    >
      <span
        :class="[
          { expanded: node.isExpanded, 'is-leaf': node.isLeaf },
          'el-tree-node__expand-icon',
          elTree.props.iconClass
        ]"
        @click.stop="
          node.isLeaf ||
            (elTree.props.accordion ? node.collapse() : node.expand())
        "
      >
      </span>
      <el-checkbox
        v-if="elTree.props.showCheckbox"
        :modelValue="node.isChecked"
        :indeterminate="node.isIndeterminate"
        :disabled="node.isDisabled"
        @update:modelValue="onChangeCheckbox"
        @click="elTree.emit('check', node, node.isChecked, $event)"
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
        class="el-tree-node__children"
        v-show="node.isExpanded"
        v-if="!elTree.props.renderAfterExpand || node.isRendered"
        role="group"
        :aria-expanded="node.isExpanded"
      >
        <el-tree-node
          v-for="child in node.childNodes"
          :key="child.id"
          :node="child"
        >
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import ElCollapseTransition from '../../src/transitions/collapse-transition'
import ElCheckbox from '../checkbox'
import ElNodeContent from './NodeContent'
import { TreeNode } from './entity/TreeNode'
import { inject } from 'vue'

export default {
  name: 'ElTreeNode',

  props: {
    node: TreeNode
  },

  components: {
    ElCollapseTransition,
    ElCheckbox,
    ElNodeContent
  },

  setup(props) {
    const elTree = inject('elTree')
    const onClickNode = (e) => {
      !elTree.props.expandOnClickNode ||
        props.node.isLeaf ||
        (elTree.props.accordion ? props.node.collapse() : props.node.expand())

      !elTree.props.checkOnClickNode ||
        props.node.setChecked(undefined, elTree.props.checkStrictly)

      elTree.emit('node-click', props.node, e)
      elTree.emit('current-change', props.node, e)
      props.node.isExpanded
        ? elTree.emit('node-expand', props.node, e)
        : elTree.emit('node-collapse', props.node, e)
    }

    const onRightEvent = (e) => {
      if (!elTree.vnode.props['onNode-contextmenu']) return

      e.preventDefault()

      elTree.emit('node-contextmenu', props.node, e)
    }

    const onChangeCheckbox = (e) => {
      props.node.setChecked(undefined, elTree.props.checkStrictly)
      elTree.emit('check-change', props.node, e)
    }

    return {
      elTree,
      onClickNode,
      onRightEvent,
      onChangeCheckbox
    }
  }
}
</script>
