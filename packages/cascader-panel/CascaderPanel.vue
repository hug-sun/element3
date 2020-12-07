<template>
  <div
    :class="['el-cascader-panel', border && 'is-bordered']"
    @keydown="handleKeyDown"
  >
    <cascader-menu
      v-for="(menu, index) in menus"
      :ref="
        (el) => {
          if (el) menuRef[index] = el
        }
      "
      :index="index"
      :key="index"
      :nodes="menu"
    ></cascader-menu>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watch,
  toRefs,
  nextTick,
  onMounted,
  onBeforeUpdate
} from 'vue'
import CascaderMenu from './CascaderMenu'
import Store from './Store'
import merge from '../../src/utils/merge'
import AriaUtils from '../../src/utils/aria-utils'
import scrollIntoView from '../../src/utils/scroll-into-view'
import {
  noop,
  coerceTruthyValueToArray,
  isEqual,
  isEmpty,
  valueEquals
} from '../../src/utils/util'

const { keys: KeyCode } = AriaUtils
const DefaultProps = {
  expandTrigger: 'click', // or hover
  multiple: false,
  checkStrictly: false, // whether all nodes can be selected
  emitPath: true, // wether to emit an array of all levels value in which node is located
  lazy: false,
  lazyLoad: noop,
  value: 'value',
  label: 'label',
  children: 'children',
  leaf: 'leaf',
  disabled: 'disabled',
  hoverThreshold: 500
}

const isLeaf = (el) => !el.getAttribute('aria-owns')

const getSibling = (el, distance) => {
  const { parentNode } = el
  if (parentNode) {
    const siblings = parentNode.querySelectorAll(
      '.el-cascader-node[tabindex="-1"]'
    )
    const index = Array.prototype.indexOf.call(siblings, el)
    return siblings[index + distance] || null
  }
  return null
}

const getMenuIndex = (el) => {
  if (!el) return
  const pieces = el.id.split('-')
  return Number(pieces[pieces.length - 2])
}

const focusNode = (el) => {
  if (!el) return
  el.focus()
  !isLeaf(el) && el.click()
}

const checkNode = (el) => {
  if (!el) return

  const input = el.querySelector('input')
  if (input) {
    input.click()
  } else if (isLeaf(el)) {
    el.click()
  }
}

export default {
  name: 'ElCascaderPanel',

  components: {
    CascaderMenu
  },

  emits: [
    'update:modelValue',
    'change',
    'close',
    'active-item-change',
    'expand-change'
  ],

  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    options: Array,
    props: Object,
    border: {
      type: Boolean,
      default: true
    },
    renderLabel: Function,
    computePresentText: Function
  },

  provide() {
    return {
      panel: this
    }
  },

  setup(props, { slots, emit }) {
    const menuRef = ref([])
    const activePath = ref([])
    const checkedNodePaths = ref([])
    const loadCount = ref(0)
    const checkedValue = ref(null)

    const { props: realProps, options, renderLabel, modelValue } = toRefs(props)

    const renderLabelFn = computed(() => renderLabel?.value || slots?.default)

    const {
      config,
      multiple,
      checkStrictly,
      leafOnly,
      isHoverMenu
    } = useConfig(realProps)

    let state = reactive({
      store: null,
      menus: null
    })
    const lazyLoad = (node, onFulfilled) => {
      if (!node) {
        node = { root: true, level: 0 }
        state.store = new Store([], config.value)
        state.menus = [state.store.getNodes()]
      }
      node.loading = true
      const resolve = (dataList) => {
        const parent = node.root ? null : node
        dataList && dataList.length && state.store.appendNodes(dataList, parent)
        node.loading = false
        node.loaded = true

        // dispose default value on lazy load mode
        if (Array.isArray(checkedValue.value)) {
          const nodeValue = checkedValue.value[loadCount.value++]
          const valueKey = config.value.value
          const leafKey = config.value.leaf

          if (
            Array.isArray(dataList) &&
            dataList.filter((item) => item[valueKey] === nodeValue).length > 0
          ) {
            const checkedNode = state.store.getNodeByValue(nodeValue)

            if (!checkedNode.data[leafKey]) {
              lazyLoad(checkedNode, () => {
                handleExpand(checkedNode)
              })
            }

            if (loadCount.value === checkedValue.value.length) {
              props.computePresentText()
            }
          }
        }

        onFulfilled && onFulfilled(dataList)
      }
      config.value.lazyLoad(node, resolve)
    }

    const getFlattedNodes = (leafOnly) => {
      const cached = !config.value.lazy
      return state.store.getFlattedNodes(leafOnly, cached)
    }
    const { handleExpand, expandNodes, handleKeyDown } = useExpendMethods({
      menuRef,
      activePath,
      state,
      emit
    })
    const syncActivePath = () => {
      if (!isEmpty(activePath.value)) {
        const nodes = activePath.value.map((node) =>
          state.store.getNodeByValue(node.getValue())
        )
        expandNodes(nodes)
      } else if (!isEmpty(checkedValue.value)) {
        const value = multiple.value
          ? checkedValue.value[0]
          : checkedValue.value
        const checkedNode = state.store.getNodeByValue(value) || {}
        const nodes = (checkedNode.pathNodes || []).slice(0, -1)
        expandNodes(nodes)
      } else {
        activePath.value = []
        state.menus = [state.store.getNodes()]
      }
    }
    const changedScrollIntoView = () => {
      const menus = menuRef.value || []
      menus.forEach((menu) => {
        const menuElement = menu.$el
        if (menuElement) {
          const container = menuElement.querySelector('.el-scrollbar__wrap')
          const activeNode =
            menuElement.querySelector('.el-cascader-node.is-active') ||
            menuElement.querySelector('.el-cascader-node.in-active-path')
          scrollIntoView(container, activeNode)
        }
      })
    }
    const {
      syncMenuState,
      clearCheckedNodes,
      syncCheckedValue,
      getCheckedNodes,
      calculateCheckedNodePaths,
      calculateMultiCheckedValue
    } = useCheckedMethods({
      state,
      config,
      leafOnly,
      modelValue,
      multiple,
      checkedValue,
      checkedNodePaths,
      syncActivePath,
      scrollIntoView: changedScrollIntoView,
      getFlattedNodes
    })
    const handleCheckChange = (value) => {
      checkedValue.value = value
    }
    onMounted(() => {
      if (!isEmpty(modelValue?.value)) {
        syncCheckedValue()
      }
    })
    onBeforeUpdate(() => {
      menuRef.value = []
    })

    watch(
      options,
      () => {
        if (config.value.lazy && isEmpty(options.value)) {
          lazyLoad()
        } else {
          state.store = new Store(options.value, config.value)
          state.menus = [state.store.getNodes()]
          syncMenuState()
        }
      },
      {
        immediate: true,
        deep: true
      }
    )
    watch(modelValue, () => {
      syncCheckedValue()
      checkStrictly.value && calculateCheckedNodePaths()
    })
    watch(checkedValue, (val) => {
      if (!isEqual(val, modelValue?.value)) {
        checkStrictly.value && calculateCheckedNodePaths()
        emit('update:modelValue', val)
        emit('change', val)
      }
    })

    return {
      // state
      // ref
      menuRef,
      // data
      checkedValue,
      activePath,
      checkedNodePaths,
      menus: toRefs(state).menus,
      // computed
      config,
      multiple,
      checkStrictly,
      leafOnly,
      isHoverMenu,
      // methods
      getNodeByValue(val) {
        return state.store.getNodeByValue(val)
      },
      lazyLoad,
      getCheckedNodes,
      getFlattedNodes,
      handleCheckChange,
      handleExpand,
      renderLabelFn,
      handleKeyDown,
      clearCheckedNodes,
      calculateMultiCheckedValue,
      scrollIntoView: changedScrollIntoView
    }
  }
}

const useConfig = (props) => {
  const config = computed(() => merge({ ...DefaultProps }, props?.value))
  const multiple = computed(() => config.value.multiple)
  const checkStrictly = computed(() => config.value.checkStrictly)
  const leafOnly = computed(() => !checkStrictly.value)
  const isHoverMenu = computed(() => config.value.expandTrigger === 'trigger')

  return {
    config,
    multiple,
    checkStrictly,
    leafOnly,
    isHoverMenu
  }
}

const useExpendMethods = ({ menuRef, activePath, state, emit }) => {
  const handleExpand = (node, silent) => {
    const activePathValue = activePath.value
    const { level } = node
    const path = activePathValue.slice(0, level - 1)
    const internalMenus = [...state.menus].slice(0, level)

    if (!node.isLeaf) {
      path.push(node)
      internalMenus.push(node.children)
    }

    activePath.value = path
    state.menus = internalMenus

    if (!silent) {
      const pathValues = path.map((node) => node.getValue())
      const activePathValues = activePath.value.map((node) => node.getValue())
      if (!valueEquals(pathValues, activePathValues)) {
        emit('active-item-change', pathValues)
        emit('expand-change', pathValues)
      }
    }
  }
  const expandNodes = (nodes) => {
    nodes.forEach((node) => handleExpand(node, true))
  }
  const handleKeyDown = ({ target, keyCode }) => {
    const prev = getSibling(target, -1)
    const next = getSibling(target, 1)
    const preMenu = menuRef.value[getMenuIndex(target) - 1]
    const nextMenu = menuRef.value[getMenuIndex(target) + 1]

    switch (keyCode) {
      case KeyCode.up:
        focusNode(prev)
        break
      case KeyCode.down:
        focusNode(next)
        break
      case KeyCode.left:
        if (preMenu) {
          const expandedNode = preMenu.$el.querySelector(
            '.el-cascader-node[aria-expanded="true"]'
          )
          focusNode(expandedNode)
        }
        break
      case KeyCode.right:
        if (nextMenu) {
          const firstNode = nextMenu.$el.querySelector(
            '.el-cascader-node[tabindex="-1"]'
          )
          focusNode(firstNode)
        }
        break
      case KeyCode.enter:
        checkNode(target)
        break
      case KeyCode.esc:
      case KeyCode.tab:
        emit('close')
        break
      default:
        return
    }
  }

  return {
    handleExpand,
    expandNodes,
    handleKeyDown
  }
}

const useCheckedMethods = ({
  state,
  config,
  leafOnly,
  modelValue,
  checkedValue,
  checkedNodePaths,
  syncActivePath,
  scrollIntoView,
  getFlattedNodes
}) => {
  const syncMultiCheckState = () => {
    const nodes = getFlattedNodes(leafOnly.value)

    nodes.forEach((node) => {
      node.syncCheckState(checkedValue.value)
    })
  }
  const syncMenuState = async () => {
    syncActivePath()
    config.value.multiple && syncMultiCheckState()
    config.value.checkStrictly && calculateCheckedNodePaths()
    await nextTick(scrollIntoView)
  }
  const syncCheckedValue = () => {
    if (!isEqual(modelValue.value, checkedValue.value)) {
      checkedValue.value = modelValue.value
      syncMenuState()
    }
  }
  const calculateCheckedNodePaths = () => {
    const checkedValues = config.value.multiple
      ? coerceTruthyValueToArray(checkedValue.value)
      : [checkedValue.value]
    checkedNodePaths.value = checkedValues.map((v) => {
      return state.store.getNodeByValue(v)?.pathNodes || []
    })
  }
  const getCheckedNodes = (leafOnly) => {
    if (config.value.multiple) {
      const nodes = getFlattedNodes(leafOnly)
      return nodes.filter((node) => node.checked)
    } else {
      return isEmpty(checkedValue.value)
        ? []
        : [state.store.getNodeByValue(checkedValue.value)]
    }
  }
  const calculateMultiCheckedValue = () => {
    checkedValue.value = getCheckedNodes(leafOnly.value).map((node) =>
      node.getValueByOption()
    )
  }
  const clearCheckedNodes = () => {
    if (config.value.multiple) {
      getCheckedNodes(leafOnly.value)
        .filter((node) => !node.isDisabled)
        .forEach((node) => node.doCheck(false))
      calculateMultiCheckedValue()
    } else {
      checkedValue.value = config.value.emitPath ? [] : null
    }
  }

  return {
    syncMenuState,
    getCheckedNodes,
    syncCheckedValue,
    clearCheckedNodes,
    calculateCheckedNodePaths,
    calculateMultiCheckedValue
  }
}
</script>
