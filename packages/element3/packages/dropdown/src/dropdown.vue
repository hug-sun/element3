<script lang="jsx">
import {
  provide,
  toRefs,
  getCurrentInstance,
  ref,
  computed,
  watch,
  h
} from 'vue'
import { useEmitter } from '../../../src/composables/emitter.js'
import Clickoutside from '../../../src/directives/clickoutside.js'

import { ElButton } from '../../../src/components/Button'
import ElButtonGroup from '../../button-group'
import { generateId } from '../../../src/utils/util.js'

export default {
  name: 'ElDropdown',

  componentName: 'ElDropdown',

  directives: { Clickoutside },

  emits: ['menu-item-click', 'visible-change', 'command'],

  components: {
    ElButton,
    ElButtonGroup
  },

  provide() {
    return {
      dropdown: this
    }
  },

  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    type: String,
    size: {
      type: String,
      default: ''
    },
    splitButton: Boolean,
    hideOnClick: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom-end'
    },
    visibleArrow: {
      default: true
    },
    showTimeout: {
      type: Number,
      default: 250
    },
    hideTimeout: {
      type: Number,
      default: 150
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()
    const {
      size,
      trigger,
      showTimeout,
      tabindex,
      hideTimeout,
      hideOnClick,
      splitButton,
      type
    } = toRefs(props)
    const dropdownSize = computed(() => {
      return size.value || instance.proxy?.$ELEMENT?.size
    })

    const timeout = ref(0)
    const visible = ref(false)
    const triggerElm = ref(null)
    const show = () => {
      if (triggerElm.value?.disabled) return
      clearTimeout(timeout.value)
      timeout.value = setTimeout(
        () => {
          visible.value = true
        },
        trigger.value === 'click' ? 0 : showTimeout.value
      )
    }

    const hide = () => {
      if (triggerElm.value?.disabled) return
      removeTabindex()
      if (tabindex.value >= 0) {
        resetTabindex(triggerElm.value)
      }
      clearTimeout(timeout.value)
      timeout.value = setTimeout(
        () => {
          visible.value = false
        },
        trigger.value === 'click' ? 0 : hideTimeout.value
      )
    }

    const handleClick = () => {
      if (triggerElm.value?.disabled) return
      if (visible.value) {
        hide()
      } else {
        show()
      }
    }

    const menuItems = ref(null)
    const handleTriggerKeyDown = (ev) => {
      const _keyCode = ev.keyCode
      if ([38, 40].indexOf(_keyCode) > -1) {
        // up/down
        removeTabindex()
        resetTabindex(menuItems.value[0])
        menuItems.value[0].focus()
        ev.preventDefault()
        ev.stopPropagation()
      } else if (_keyCode === 13) {
        // space enter选中
        handleClick()
      } else if ([9, 27].indexOf(_keyCode) > -1) {
        // tab || esc
        hide()
      }
    }

    const menuItemsArray = ref(null)

    const handleItemKeyDown = (ev) => {
      const _keyCode = ev.keyCode
      const _target = ev.target
      const _currentIndex = menuItemsArray.value.indexOf(_target)
      const _max = menuItemsArray.value.length - 1
      let _nextIndex
      if ([38, 40].indexOf(_keyCode) > -1) {
        // up/down
        if (_keyCode === 38) {
          // up
          _nextIndex = _currentIndex !== 0 ? _currentIndex - 1 : 0
        } else {
          // down
          _nextIndex = _currentIndex < _max ? _currentIndex + 1 : _max
        }
        removeTabindex()
        resetTabindex(menuItems.value[_nextIndex])
        menuItems.value[_nextIndex].focus()
        ev.preventDefault()
        ev.stopPropagation()
      } else if (_keyCode === 13) {
        // enter选中
        triggerElmFocus()
        _target.click()
        if (hideOnClick.value) {
          // click关闭
          visible.value = false
        }
      } else if ([9, 27].indexOf(_keyCode) > -1) {
        // tab // esc
        hide()
        triggerElmFocus()
      }
    }

    const resetTabindex = (ele) => {
      // 下次tab时组件聚焦元素
      removeTabindex()
      ele.setAttribute('tabindex', '0') // 下次期望的聚焦元素
    }
    const removeTabindex = () => {
      triggerElm.value.setAttribute('tabindex', '-1')
      menuItemsArray.value.forEach((item) => {
        item.setAttribute('tabindex', '-1')
      })
    }

    const dropdownElm = ref(null)
    const listId = ref(`dropdown-menu-${generateId()}`)
    const initAria = () => {
      dropdownElm.value.setAttribute('id', listId.value)
      triggerElm.value.setAttribute('aria-haspopup', 'list')
      triggerElm.value.setAttribute('aria-controls', listId.value)

      if (!splitButton.value) {
        // 自定义
        triggerElm.value.setAttribute('role', 'button')
        triggerElm.value.setAttribute('tabindex', tabindex.value)
        triggerElm.value.setAttribute(
          'class',
          (triggerElm.value.getAttribute('class') || '') +
            ' el-dropdown-selfdefine'
        ) // 控制
      }
    }

    const focusing = ref(false)
    const initEvent = () => {
      triggerElm.value = splitButton.value
        ? instance.proxy.$refs.trigger.$el
        : instance.proxy.$el.children[0]
      triggerElm.value.addEventListener('keydown', handleTriggerKeyDown) // triggerElm keydown
      dropdownElm.value.addEventListener('keydown', handleItemKeyDown, true) // item keydown
      // 控制自定义元素的样式
      if (!splitButton.value) {
        triggerElm.value.addEventListener('focus', () => {
          focusing.value = true
        })
        triggerElm.value.addEventListener('blur', () => {
          focusing.value = false
        })
        triggerElm.value.addEventListener('click', () => {
          focusing.value = false
        })
      }
      if (trigger.value === 'hover') {
        triggerElm.value.addEventListener('mouseenter', show)
        triggerElm.value.addEventListener('mouseleave', hide)
        dropdownElm.value.addEventListener('mouseenter', show)
        dropdownElm.value.addEventListener('mouseleave', hide)
      } else if (trigger.value === 'click') {
        triggerElm.value.addEventListener('click', handleClick)
      }
    }
    const handleMenuItemClick = (command, instance) => {
      if (hideOnClick.value) {
        visible.value = false
      }
      emit('command', command, instance)
    }
    const triggerElmFocus = () => {
      triggerElm.value.focus && triggerElm.value.focus()
    }
    const initDomOperation = () => {
      dropdownElm.value = instance.proxy.popperElm
      menuItems.value = dropdownElm.value.querySelectorAll("[tabindex='-1']")
      menuItemsArray.value = [].slice.call(menuItems.value)

      initEvent()
      initAria()
    }

    const { broadcast, on } = useEmitter(instance)
    watch(visible, (val) => {
      broadcast('visible', val)
      emit('visible-change', val)
    })

    on('menu-item-click', handleMenuItemClick)

    watch(focusing, (val) => {
      const selfDefine = instance.proxy.$el.querySelector(
        '.el-dropdown-selfdefine'
      )
      if (selfDefine) {
        // 自定义
        if (val) {
          selfDefine.className += ' focusing'
        } else {
          selfDefine.className = selfDefine.className.replace('focusing', '')
        }
      }
    })

    instance.proxy.initDomOperation = initDomOperation
    instance.proxy.dropdownSize = dropdownSize.value
    instance.proxy.visible = visible.value
    instance.proxy.broadcast = broadcast

    provide('dropdown', instance)

    const handleMainButtonClick = (event) => {
      emit('click', event)
      hide()
    }

    return () => {
      const defaultNode = slots.default() ? slots.default()[0] : h('span')
      const dropdownNode = slots.default() ? slots.default()[1] : h('ul')

      const triggerElm = !splitButton.value ? (
        defaultNode
      ) : (
        <el-button-group>
          <el-button
            type={type.value}
            size={dropdownSize.value}
            nativeOn-click={handleMainButtonClick}
          >
            {defaultNode}
          </el-button>
          <el-button
            ref="trigger"
            type={type.value}
            size={dropdownSize.value}
            class="el-dropdown__caret-button"
          >
            <i class="el-dropdown__icon el-icon-arrow-down"></i>
          </el-button>
        </el-button-group>
      )

      // fixme: directive api not work
      // const vClickoutside = resolveDirective('clickoutside')
      //
      // return withDirectives(
      //   h('div', { class: 'el-dropdown' }, [triggerElm, slots.dropdown]),
      //   [vClickoutside, hide]
      // )

      return h('div', { class: 'el-dropdown' }, [triggerElm, dropdownNode])
    }
  }
}
</script>
