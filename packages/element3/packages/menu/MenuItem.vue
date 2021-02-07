<template>
  <li
    class="el-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, itemStyle, { backgroundColor: itemBackgroundColor }]"
    :class="{
      'is-active': active,
      'is-disabled': disabled
    }"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <el-tooltip
      v-if="
        parentMenu.type.name === 'ElMenu' &&
        rootMenu.proxy.collapse &&
        $slots.title
      "
      effect="dark"
      placement="right"
    >
      <template v-slot:content>
        <div>
          <slot name="title"></slot>
        </div>
      </template>
      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          display: inline-block;
          box-sizing: border-box;
          padding: 0 20px;
        "
      >
        <slot></slot>
      </div>
    </el-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
import { useMenu } from './src/menu-use'
import ElTooltip from '../tooltip'
import { useEmitter } from '../../src/composables/emitter'
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs
} from 'vue'

export default {
  name: 'ElMenuItem',

  componentName: 'ElMenuItem',

  components: { ElTooltip },

  props: {
    index: {
      default: null,
      validator: (val) => typeof val === 'string' || val === null
    },
    route: [String, Object],
    disabled: Boolean
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { index, disabled } = toRefs(props)
    const { parentMenu, paddingStyle, rootMenu, indexPath } = useMenu(
      index.value
    )
    const instance = getCurrentInstance()
    const { dispatch } = useEmitter()
    const active = computed(() => {
      return index.value === rootMenu.proxy.activeIndex
    })
    const hoverBackground = computed(() => {
      return rootMenu.props.hoverBackground
    })
    const backgroundColor = computed(() => {
      return rootMenu.props.backgroundColor || ''
    })
    const itemBackgroundColor = ref(backgroundColor.value)
    const activeTextColor = computed(() => {
      return rootMenu.props.activeTextColor || ''
    })
    const textColor = computed(() => {
      return rootMenu.props.textColor || ''
    })
    const mode = computed(() => {
      return rootMenu.props.mode
    })
    const isNested = computed(() => {
      return parentMenu !== rootMenu
    })
    const itemStyle = computed(() => {
      const style = {
        color: active.value ? activeTextColor.value : textColor.value
      }
      if (mode.value === 'horizontal' && !isNested.value) {
        style.borderBottomColor = active.value
          ? rootMenu.activeTextColor.value
            ? activeTextColor.value
            : ''
          : 'transparent'
      }
      return style
    })
    const onMouseEnter = () => {
      hoverBackground.value &&
        (itemBackgroundColor.value = hoverBackground.value)
    }
    const onMouseLeave = () => {
      itemBackgroundColor.value = backgroundColor.value
    }
    const handleClick = () => {
      if (!disabled.value) {
        dispatch('item-click', instance)
        emit('click', instance)
      }
    }
    onMounted(() => {
      parentMenu.value.setupState.addItem(instance)
      rootMenu.setupState.addItem(instance)
    })
    onBeforeUnmount(() => {
      parentMenu.value.setupState.removeItem(instance)
      rootMenu.setupState.removeItem(instance)
    })
    return {
      paddingStyle,
      itemStyle,
      active,
      handleClick,
      onMouseEnter,
      onMouseLeave,
      rootMenu,
      parentMenu,
      indexPath,
      itemBackgroundColor
    }
  }
}
</script>
