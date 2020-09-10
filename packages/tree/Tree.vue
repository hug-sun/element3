<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent
    }"
    role="tree"
  >
    <el-tree-node
      v-for="child in tree.root.childNodes"
      :node="child"
      :key="child.id"
    >
    </el-tree-node>
    <div class="el-tree__empty-block" v-if="tree.isEmpty">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
    <div
      v-show="
        dragState.current &&
        (dragState.drop === 'top' || dragState.drop === 'bottom')
      "
      class="el-tree__drop-indicator"
      ref="dropIndicator"
    ></div>
  </div>
</template>

<script>
import { Tree } from './entity/Tree'
import ElTreeNode from './TreeNode.vue'
import { t } from 'element-ui/src/locale'
import { extractMethods } from './libs/util'
// import emitter from 'element-ui/src/mixins/emitter'
// import { addClass, removeClass } from 'element-ui/src/utils/dom'
import {
  reactive,
  toRefs,
  provide,
  getCurrentInstance,
  onMounted,
  ref
} from 'vue'

export default {
  name: 'ElTree',

  components: {
    ElTreeNode
  },

  props: {
    data: { type: Array, default: () => [] },
    emptyText: { type: String, default: () => t('el.tree.emptyText') },
    renderAfterExpand: { type: Boolean, default: true },
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: { type: Boolean, default: true },
    checkOnClickNode: Boolean,
    checkDescendants: { type: Boolean, default: false },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
    allowDrag: Function,
    allowDrop: Function,
    defaultNodeKey: {
      type: Object,
      default: () => ({
        id: 'id',
        label: 'label',
        childNodes: 'children',
        isDisabled: 'isDisabled',
        isAsync: 'isAsync',
        isChecked: 'isChecked',
        isVisable: 'isVisable',
        isExpanded: 'isExpanded'
      })
    }, // {treeNodeKey : rawNodeKey}
    highlightCurrent: Boolean,
    accordion: Boolean,
    indent: { type: Number, default: 18 },
    iconClass: { type: String, default: 'el-icon-caret-right' },
    async: { type: Boolean, default: false },
    asyncLoadFn: Function
  },

  emits: [
    'node-click',
    'node-contextmenu',
    'check-change',
    'check',
    'current-change',
    'node-expand',
    'node-collapse',
    'node-drag-start',
    'node-drag-enter',
    'node-drag-leave',
    'node-drag-over',
    'node-drag-end',
    'node-drop'
  ],

  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const dropIndicator = ref()
    const tree = new Tree(props.data, props.defaultNodeKey, {
      asyncLoadFn: props.asyncLoadFn,
      isAsync: props.async
    })
    const state = reactive({
      tree
    })

    const dragState = reactive({
      start: null /* TreeNode */,
      current: null /* TreeNode */,
      last: null /* TreeNode */,
      drop: '' /* String > inner | top | bottom */
    })

    provide('elTree', instance)
    useInitTree(props, state)
    onMounted(() => {
      if (props.currentNodeKey) {
        const node = document.getElementById('TreeNode' + props.currentNodeKey)
        if (node) {
          node.focus()
        }
      }
    })

    const handleDragStart = (node, e) => {
      if (typeof props.allowDrag === 'function' && !props.allowDrag(node, e)) {
        e.preventDefault()
        return false
      }
      dragState.start = node
      emit('node-drag-start', node, e)
    }
    const handleDragOver = (node, e) => {
      dragState.current = node
      if (dragState.start === node) return
      const margin = 7
      const target = e.path.find((item) => item.id === 'TreeNode' + node.id)
      const currentBound = target.getBoundingClientRect()
      const mourseY = e.clientY

      if (currentBound.top + margin > mourseY) {
        dropIndicator.value.style.top = target.offsetTop + 'px'
        dropIndicator.value.style.left = node.level * props.indent + 'px'
        dragState.drop = 'top'
      } else if (currentBound.top + currentBound.height - margin < mourseY) {
        dropIndicator.value.style.top =
          target.offsetTop + currentBound.height + 'px'
        dropIndicator.value.style.left = node.level * props.indent + 'px'
        dragState.drop = 'bottom'
      } else {
        dragState.drop = 'inner'
        node.expand(true)
      }

      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        e.dataTransfer.setData('text/plain', '')
      } catch (e) {}
      e.preventDefault()

      emit('node-drag-over', dragState.start, node, e)
      emit('node-drag-enter', dragState.start, node, e)
      emit('node-drag-leave', dragState.start, dragState.last, e)
      dragState.last = node
    }

    const handleDragEnd = (node, e) => {
      dragState.current = null
      emit('node-drag-end', dragState.start, node, e)
    }

    const handleDrop = (node, e) => {
      if (typeof props.allowDrog === 'function' && !props.allowDrog(node, e)) {
        e.preventDefault()
        return false
      }
      dragState.last = node
      dragState.start.move(node, dragState.drop)
      emit('node-drop', dragState.start, node, e)
    }

    return {
      dragState,
      ...toRefs(state),
      ...extractMethods(state.tree.root, [
        'append',
        'remove',
        'insert',
        'removeChild',
        'setChecked',
        'setChildChecked',
        'upwardEach',
        'depthEach',
        'findOne',
        'findMany',
        'findChildIndex',
        'expand',
        'setVsiable',
        'move',
        'filter'
      ]),
      root: state.tree.root,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      handleDrop,
      dropIndicator
    }
  }
}

function useInitTree(props, state) {
  if (props.defaultExpandAll) {
    state.tree.expandAll()
  }

  state.tree.setCheckedByIdList(props.defaultCheckedKeys, true)
  state.tree.setExpandedByIdList(props.defaultExpandedKeys, true)
}
</script>
