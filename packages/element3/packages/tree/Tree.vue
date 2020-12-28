<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent
    }"
    role="Tree"
    @keydown="handleKeydown"
  >
    <template v-if="showRootNode">
      <el-tree-node :node="tree.root" :key="tree.root.id"> </el-tree-node>
    </template>
    <template v-else>
      <el-tree-node
        v-for="child in tree.root.childNodes"
        :node="child"
        :key="child.id"
      >
      </el-tree-node>
    </template>
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
import { t } from '../../src/locale'
import { isFunction } from '../../src/utils/types'
import { extractMethods } from './libs/util'

import {
  reactive,
  toRefs,
  provide,
  getCurrentInstance,
  onMounted,
  ref,
  onUpdated,
  watchEffect
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
    checked: Array /* model */,
    expanded: Array /* model */,
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
        childNodes: 'childNodes',
        isDisabled: 'isDisabled',
        isAsync: 'isAsync',
        isChecked: 'isChecked',
        isVisable: 'isVisable',
        isExpanded: 'isExpanded',
        isLeaf: 'isLeaf'
      })
    }, // {treeNodeKey : rawNodeKey}
    highlightCurrent: Boolean,
    accordion: Boolean,
    indent: { type: Number, default: 18 },
    iconClass: { type: String, default: 'el-icon-caret-right' },
    async: { type: Boolean, default: false },
    asyncLoadFn: Function,
    showRootNode: Boolean
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
    'node-drop',
    'update:checked',
    'update:expanded'
  ],

  setup(props) {
    const instance = getCurrentInstance()

    const tree = new Tree(props.data, props.defaultNodeKey, {
      asyncLoadFn: props.asyncLoadFn,
      isAsync: props.async
    })

    const state = reactive({
      tree
    })

    provide('elTree', instance)

    useTab()

    useExpand(props, state)

    useCheckbox(props, state)

    useFocusNode(props)

    const { handleKeydown } = useKeyDown()

    const drag = useDrag(props)

    return {
      ...drag,
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
      ...extractMethods(state.tree, [
        'initRoot',
        'getParentRawNode',
        'showAll',
        'checkedAll',
        'expandAll'
      ]),
      tree: state.tree,
      root: state.tree.root,
      handleKeydown
    }
  }
}

function useCheckbox(props, state) {
  const instance = getCurrentInstance()
  const { emit } = instance

  watchEffect(() => {
    if (props.checked) state.tree.setCheckedByIdList(props.checked)
  })

  watchEffect(() => {
    emit('update:checked', state.tree.checked)
  })
}

function useExpand(props, state) {
  const instance = getCurrentInstance()
  const { emit } = instance

  if (props.defaultExpandAll) {
    state.tree.expandAll()
  }

  watchEffect(() => {
    emit('update:expanded', state.tree.expanded)
  })

  watchEffect(() => {
    state.tree.setExpandedByIdList(props.expanded, true)
  })

  onMounted(() => {
    state.tree.root.expand(true)
  })
}

function useTab() {
  const instance = getCurrentInstance()
  const { proxy } = instance

  const initCheckbox = () => {
    const checkboxItems = proxy.$el.querySelectorAll('input[type=checkbox]')
    Array.prototype.forEach.call(checkboxItems, (checkbox) => {
      checkbox.setAttribute('tabindex', -1)
    })
  }
  const initTabIndex = () => {
    const treeItems = proxy.$el.querySelectorAll('.is-focusable[role=TreeItem]')
    const checkedItem = proxy.$el.querySelectorAll('.is-checked[role=TreeItem]')
    if (checkedItem.length) {
      checkedItem[0].setAttribute('tabindex', 0)
      return
    }
    treeItems[0] && treeItems[0].setAttribute('tabindex', 0)
  }

  onMounted(initTabIndex)
  onUpdated(initCheckbox)
}

function useKeyDown() {
  const instance = getCurrentInstance()
  const { proxy } = instance
  const handleKeydown = (ev) => {
    const currentItem = ev.target
    if (currentItem.className.indexOf('el-tree-node') === -1) return
    const { key } = ev
    const treeItems = proxy.$el.querySelectorAll('.is-focusable[role=TreeNode]')
    const treeItemArray = Array.prototype.slice.call(treeItems)
    const currentIndex = treeItemArray.indexOf(currentItem)
    let nextIndex
    if (['ArrowUp', 'ArrowDown'].indexOf(key) > -1) {
      // up、down
      ev.preventDefault()
      if (key === 'ArrowUp') {
        // up
        nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
      } else {
        nextIndex =
          currentIndex < treeItemArray.length - 1 ? currentIndex + 1 : 0
      }
      treeItemArray[nextIndex].focus() // 选中
    }
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) > -1) {
      // left、right 展开
      currentItem.click() // 选中
      ev.preventDefault()
    }
    const hasInput = currentItem.querySelector('[type="checkbox"]')
    if (['Enter', 'Space'].indexOf(key) > -1 && hasInput) {
      // space enter选中checkbox
      hasInput.click()
      ev.preventDefault()
    }
  }

  return {
    handleKeydown
  }
}

function useDrag(props) {
  const instance = getCurrentInstance()
  const { emit } = instance

  const dropIndicator = ref()

  const dragState = reactive({
    start: null /* TreeNode */,
    current: null /* TreeNode */,
    last: null /* TreeNode */,
    drop: '' /* String => inner | top | bottom */
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
    // setData is required for draggable to work in FireFox
    // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
    e &&
      e.dataTransfer &&
      isFunction(e.dataTransfer.setData) &&
      e.dataTransfer.setData('text/plain', '')
    e.preventDefault()

    emit('node-drag-enter', dragState.start, node, e)
    emit('node-drag-over', dragState.start, node, e)
    emit('node-drag-leave', dragState.start, dragState.last, e)
    dragState.last = node
  }

  const handleDragEnd = (node, e) => {
    dragState.current = null
    emit('node-drag-end', dragState.start, node, e)
  }

  const handleDrop = (node, e) => {
    if (
      typeof props.allowDrog === 'function' &&
      !props.allowDrog(dragState.start, node, dragState.drop, e)
    ) {
      e.preventDefault()
      return false
    }
    dragState.last = node
    dragState.start.move(node, dragState.drop)
    emit('node-drop', dragState.start, node, e)
  }

  return {
    dragState,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  }
}

function useFocusNode(props) {
  onMounted(() => {
    if (props.currentNodeKey) {
      const node = document.getElementById('TreeNode' + props.currentNodeKey)
      if (node) {
        node.focus()
      }
    }
  })
}
</script>
