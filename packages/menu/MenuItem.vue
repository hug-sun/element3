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
        parentMenu.type.name === 'ElMenu' && rootMenu.collapse && $slots.title
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
import { useEmitter } from '../../src/use/emitter'
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
      return index.value === rootMenu.ctx.activeIndex
    })
    const hoverBackground = computed(() => {
      return rootMenu.ctx.hoverBackground
    })
    const backgroundColor = computed(() => {
      return rootMenu.ctx.backgroundColor || ''
    })
    const itemBackgroundColor = ref(backgroundColor.value)
    const activeTextColor = computed(() => {
      return rootMenu.ctx.activeTextColor || ''
    })
    const textColor = computed(() => {
      return rootMenu.ctx.textColor || ''
    })
    const mode = computed(() => {
      return rootMenu.ctx.mode
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
      parentMenu.value.ctx.addItem(instance)
      rootMenu.ctx.addItem(instance)
    })
    onBeforeUnmount(() => {
      parentMenu.value.ctx.removeItem(instance)
      rootMenu.ctx.removeItem(instance)
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
