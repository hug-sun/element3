<template>
  <li
    role="menuitem"
    :id="nodeId"
    :aria-expanded="inActivePath"
    :tabindex="!config.checkStrictly && isDisabled ? null : -1"
    :class="{
      'el-cascader-node': true,
      'is-selectable': config.checkStrictly,
      'in-active-path': inActivePath,
      'in-checked-path': inCheckedPath,
      'is-active': isChecked,
      'is-disabled': disabled
    }"
    @click="handleClick"
    @mouseenter="handleMouseenter"
    @focus="handleMouseenter"
  >
    <template
      v-if="config.multiple || config.checkStrictly || (isLeaf && isChecked)"
    >
      <el-checkbox
        v-if="config.multiple"
        :modelValue="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="isDisabled"
        @update:modelValue="handleMultiCheckChange"
        @click.stop="
          () => {
            config.checkStrictly && strictlyEvent()
          }
        "
      ></el-checkbox>
      <el-radio
        v-else-if="config.checkStrictly"
        :modelValue="checkedValue"
        :label="value"
        :disabled="isDisabled"
        @change="handleCheckChange"
        @click="strictlyEvent"
      >
        <span></span>
      </el-radio>
      <i
        v-else-if="isLeaf && isChecked"
        class="el-icon-check el-cascader-node__prefix"
      ></i>
    </template>
    <span class="el-cascader-node__label">
      <render-helper :nodeLabel="nodeLabel"></render-helper>
    </span>
    <i v-if="loading" class="el-icon-loading el-cascader-node__postfix"></i>
    <i
      v-else-if="!isLeaf"
      class="el-icon-arrow-right el-cascader-node__postfix"
    ></i>
  </li>
</template>

<script>
import { h, computed, watch, inject, toRefs, Fragment, watchEffect } from 'vue'
import ElCheckbox from '../checkbox'
import { ElRadio } from '../../src/components/Radio'
import { isEqual } from '../../src/utils/util'

export default {
  components: {
    ElCheckbox,
    ElRadio,
    renderHelper(props) {
      const { render, node } = props.nodeLabel
      const vNode = render
        ? render({ node: node.value, data: node.value.data })
        : null
      const res = vNode || node.value.label
      return h(Fragment, {}, [res])
    }
  },
  emits: ['created', 'expand'],

  props: {
    node: {
      required: true
    },
    nodeId: String
  },

  setup(props, { emit }) {
    const { node } = toRefs(props)
    const {
      panel,
      config,
      checkedValue,
      inActivePath,
      inCheckedPath
    } = usePanel(node)
    const { value, loading, isLeaf, isDisabled, isChecked } = useNode(
      node,
      checkedValue
    )
    const nodeLabel = computed(() => ({
      node
    }))
    const disabled = computed(
      () => !config.value.checkStrictly && isDisabled.value
    )
    watchEffect(() => {
      if (isEqual(value.value, checkedValue.value))
        value.value = checkedValue.value
    })

    const handleMultiCheckChange = (checked) => {
      node.value.doCheck(checked)
      panel.calculateMultiCheckedValue()
    }
    const handleExpand = () => {
      if (
        (!config.value.checkStrictly && isDisabled.value) ||
        node.value.loading
      )
        return

      if (config.value.lazy && !node.value.loaded) {
        panel.lazyLoad(node.value, () => {
          // do not use cached leaf value here, invoke this.isLeaf to get new value.
          if (!isLeaf.value) handleExpand()

          if (config.value.multiple) {
            // if leaf sync checked state, else clear checked state
            const checked = isLeaf.value ? node.value.checked : false
            handleMultiCheckChange(checked)
          }
        })
      } else {
        panel.handleExpand(node.value)
      }
    }
    const handleCheckChange = () => {
      panel.handleCheckChange(value)
      panel.handleExpand(node.value)
    }
    const handleClick = () => {
      if (
        isLeaf.value &&
        !isDisabled.value &&
        !config.value.checkStrictly &&
        !config.value.multiple
      ) {
        handleCheckChange()
      }
      if (config.value.expandTrigger !== 'click') return
      if (config.value.expandTrigger === 'click') handleExpand()
    }
    const handleMouseenter = (e) => {
      if (config.value.expandTrigger === 'click') return
      handleExpand()
      emit('expand', e)
    }

    return {
      // state
      // data
      nodeLabel,
      disabled,
      // useNode
      value,
      loading,
      isChecked,
      isLeaf,
      isDisabled,
      // usePanel
      config,
      inActivePath,
      checkedValue,
      inCheckedPath,
      // methods
      strictlyEvent() {},
      handleClick,
      handleMouseenter,
      handleCheckChange,
      handleMultiCheckChange,
      handleExpand
    }
  }
}

const useNode = (node, checkedValue) => {
  let value = node.value.getValueByOption()
  watch(node.value, (newValue) => {
    value = newValue.getValueByOption()
  })
  const loading = computed(() => node.value.loading)
  const isLeaf = computed(() => node.value.isLeaf)
  const isDisabled = computed(() => node.value.isDisabled)
  const isChecked = computed(() => node.value.isSameNode(checkedValue.value))

  return {
    value,
    loading,
    isLeaf,
    isDisabled,
    isChecked
  }
}

const usePanel = (node) => {
  const isInPath = (pathNodes) => {
    const selectedPathNode = pathNodes?.[node?.value.level - 1] || {}
    return selectedPathNode.uid === node?.value.uid
  }
  const panel = inject('panel')
  const config = computed(() => panel.config)
  const checkedValue = computed(() => panel.checkedValue)
  const inActivePath = computed(() => isInPath(panel.activePath))
  const inCheckedPath = computed(() => {
    if (!config.value.checkStrictly) return false
    return panel.checkedNodePaths.some((checkedPath) => isInPath(checkedPath))
  })

  return {
    panel,
    config,
    checkedValue,
    inActivePath,
    inCheckedPath
  }
}
</script>
