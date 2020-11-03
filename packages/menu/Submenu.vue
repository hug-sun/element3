<script>
import ElCollapseTransition from '../../src/transitions/collapse-transition'
import { useMenu, useItems } from './src/menu-use'
import { useEmitter } from '../../src/use/emitter'
import { usePopper, popperProps } from '../../src/use/popper'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  getCurrentInstance,
  Transition,
  toRefs
} from 'vue'
export default {
  name: 'ElSubmenu',
  componentName: 'ElSubmenu',
  components: { ElCollapseTransition },
  props: {
    ...popperProps,
    transformOrigin: {
      type: [Boolean, String],
      default: false
    },
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperClass: String,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    }
  },
  emits: ['updatePopper', 'visible', 'update:modelValue', 'created'],
  setup(props, { emit, slots }) {
    const {
      index,
      disabled,
      showTimeout,
      hideTimeout,
      popperAppendToBody
    } = toRefs(props)
    const popperElm = ref(null)
    const referenceElm = ref(null)
    const menu = ref(null)
    const { doDestroy, showPopper, currentPlacement, updatePopper } = usePopper(
      props,
      {
        emit,
        slots
      },
      {
        popperElm,
        referenceElm
      }
    )
    const { parentMenu, paddingStyle, rootMenu, indexPath } = useMenu(
      index.value
    )
    const timeout = ref(null)
    const {
      items,
      itemsInstance,
      submenus,
      submenusInstance,
      addItem,
      removeItem,
      addSubmenu,
      removeSubmenu
    } = useItems()
    const mouseInChild = ref(false)
    const instance = getCurrentInstance()
    const { dispatch, on } = useEmitter()
    const handleCollapseToggle = (value) => {
      if (value) {
        initPopper()
      } else {
        doDestroy()
      }
    }
    const handleClick = () => {
      if (
        (rootMenu.ctx.menuTrigger === 'hover' &&
          rootMenu.ctx.mode === 'horizontal') ||
        (rootMenu.ctx.collapse && rootMenu.ctx.mode === 'vertical') ||
        disabled.value
      ) {
        return
      }
      dispatch('submenu-click', instance)
    }
    const handleMouseenter = (event, delay = showTimeout.value) => {
      if (
        !('ActiveXObject' in window) &&
        event.type === 'focus' &&
        !event.relatedTarget
      ) {
        return
      }
      if (
        (rootMenu.ctx.menuTrigger === 'click' &&
          rootMenu.ctx.mode === 'horizontal') ||
        (!rootMenu.ctx.collapse && rootMenu.ctx.mode === 'vertical') ||
        disabled.value
      ) {
        return
      }
      dispatch('mouse-enter-child')
      clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        rootMenu.ctx.openMenu(index.value, indexPath)
      }, delay)
      if (appendToBody.value) {
        instance.parent.ctx.$el.dispatchEvent(new MouseEvent('mouseenter'))
      }
    }
    const handleMouseleave = (deepDispatch = false) => {
      if (
        (rootMenu.ctx.menuTrigger === 'click' &&
          rootMenu.ctx.mode === 'horizontal') ||
        (!rootMenu.ctx.collapse && rootMenu.ctx.mode === 'vertical')
      ) {
        return
      }
      dispatch('mouse-leave-child')
      clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        !mouseInChild.value && rootMenu.ctx.closeMenu(index.value)
      }, hideTimeout.value)

      if (appendToBody.value && deepDispatch) {
        if (parentMenu.value && parentMenu.value.type.name === 'ElSubmenu') {
          parentMenu.value.ctx.handleMouseleave(true)
        }
      }
    }
    const handleTitleMouseenter = () => {
      hoverBackground.value && (titleBackground.value = hoverBackground.value)
    }
    const handleTitleMouseleave = () => {
      titleBackground.value = backgroundColor.value
    }
    const isFirstLevel = computed(() => {
      let isFirstLevel = true
      let parent = instance.parent
      while (parent && parent !== rootMenu) {
        if (['ElSubmenu', 'ElMenuItemGroup'].indexOf(parent.type.name) > -1) {
          isFirstLevel = false
          break
        } else {
          parent = parent.parent
        }
      }
      return isFirstLevel
    })
    const updatePlacement = () => {
      currentPlacement.value =
        mode.value === 'horizontal' && isFirstLevel.value
          ? 'bottom-start'
          : 'right-start'
    }
    const initPopper = () => {
      referenceElm.value = instance.ctx.$el
      popperElm.value = menu.value
      updatePlacement()
    }
    const appendToBody = computed(() => {
      return popperAppendToBody.value === undefined
        ? isFirstLevel
        : popperAppendToBody.value
    })
    const menuTransitionName = computed(() => {
      return rootMenu.ctx.collapse ? 'el-zoom-in-left' : 'el-zoom-in-top'
    })
    watch(rootMenu.ctx.openedMenus, (val) => {
      showPopper.value = val.indexOf(index.value) > -1
    })
    const active = computed(() => {
      let isActive = false
      Object.keys(items).forEach((index) => {
        if (itemsInstance[index].ctx.active) {
          isActive = true
        }
      })
      Object.keys(submenus).forEach((index) => {
        if (submenusInstance[index].ctx.active) {
          isActive = true
        }
      })
      return isActive
    })
    const hoverBackground = computed(() => {
      return rootMenu.ctx.hoverBackground
    })
    const backgroundColor = computed(() => {
      return rootMenu.ctx.backgroundColor || ''
    })
    const titleBackground = ref(backgroundColor.value)
    const activeTextColor = computed(() => {
      return rootMenu.ctx.activeTextColor || ''
    })

    const textColor = computed(() => {
      return rootMenu.ctx.textColor || ''
    })

    const mode = computed(() => {
      return rootMenu.ctx.mode
    })
    const isMenuPopup = computed(() => {
      return rootMenu.ctx.isMenuPopup
    })
    const titleStyle = computed(() => {
      if (mode.value !== 'horizontal') {
        return {
          color: textColor.value
        }
      }
      return {
        borderBottomColor: active.value
          ? activeTextColor.value
            ? activeTextColor.value
            : ''
          : 'transparent',
        color: active.value ? activeTextColor.value : textColor.value
      }
    })

    watch(showPopper, () => {
      if (isMenuPopup.value) {
        nextTick(() => {
          updatePopper()
        })
      }
    })
    on('toggle-collapse', handleCollapseToggle)
    on('mouse-enter-child', () => {
      mouseInChild.value = true
      clearTimeout(timeout.value)
    })
    on('mouse-leave-child', () => {
      mouseInChild.value = false
      clearTimeout(timeout.value)
    })

    onMounted(() => {
      parentMenu.value.ctx.addSubmenu(instance)
      rootMenu.ctx.addSubmenu(instance)
      initPopper()
      showPopper.value = rootMenu.ctx.openedMenus.indexOf(index.value) > -1
    })

    onBeforeUnmount(() => {
      parentMenu.value.ctx.removeSubmenu(instance)
      rootMenu.ctx.removeSubmenu(instance)
    })
    return {
      active,
      paddingStyle,
      titleStyle,
      backgroundColor,
      rootMenu,
      currentPlacement,
      menuTransitionName,
      mode,
      isFirstLevel,
      isMenuPopup,
      handleTitleMouseleave,
      handleTitleMouseenter,
      handleClick,
      handleMouseenter,
      addItem,
      removeItem,
      addSubmenu,
      removeSubmenu,
      showPopper,
      handleMouseleave,
      menu,
      titleBackground,
      indexPath
    }
  },
  render() {
    const {
      active,
      showPopper,
      paddingStyle,
      titleStyle,
      backgroundColor,
      rootMenu,
      currentPlacement,
      menuTransitionName,
      mode,
      disabled,
      popperClass,
      $slots,
      isFirstLevel,
      isMenuPopup,
      handleMouseenter,
      handleMouseleave,
      handleClick,
      handleTitleMouseleave,
      handleTitleMouseenter,
      titleBackground
    } = this
    const popupMenu = (
      <Transition name={menuTransitionName}>
        <div
          ref="menu"
          v-show={showPopper}
          class={[`el-menu--${mode}`, popperClass]}
          onMouseenter={($event) => handleMouseenter($event, 100)}
          onMouseleave={() => handleMouseleave(true)}
          onFocus={($event) => handleMouseenter($event, 100)}
        >
          <ul
            role="menu"
            class={[
              'el-menu el-menu--popup',
              `el-menu--popup-${currentPlacement}`
            ]}
            style={{ backgroundColor }}
          >
            {$slots.default()}
          </ul>
        </div>
      </Transition>
    )
    const inlineMenu = (
      <el-collapse-transition>
        <ul
          role="menu"
          class="el-menu el-menu--inline"
          v-show={showPopper}
          style={{ backgroundColor }}
        >
          {$slots.default()}
        </ul>
      </el-collapse-transition>
    )
    const submenuTitleIcon =
      (rootMenu.ctx.mode === 'horizontal' && isFirstLevel) ||
      (rootMenu.ctx.mode === 'vertical' && !rootMenu.ctx.collapse)
        ? 'el-icon-arrow-down'
        : 'el-icon-arrow-right'
    return (
      <li
        class={{
          'el-submenu': true,
          'is-active': active,
          'is-opened': showPopper,
          'is-disabled': disabled
        }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={showPopper}
        onMouseenter={handleMouseenter}
        onMouseleave={() => {
          handleMouseleave(false)
        }}
        onFocus={handleMouseenter}
      >
        <div
          class="el-submenu__title"
          onClick={handleClick}
          onMouseenter={handleTitleMouseenter}
          onMouseleave={handleTitleMouseleave}
          style={[
            paddingStyle,
            titleStyle,
            { backgroundColor: titleBackground }
          ]}
        >
          {$slots.title && $slots.title()}
          <i class={['el-submenu__icon-arrow', submenuTitleIcon]}></i>
        </div>
        {isMenuPopup ? popupMenu : inlineMenu}
      </li>
    )
  }
}
</script>
