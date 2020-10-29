<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        class="el-popover el-popper"
        :class="[popperClass, content && 'el-popover--plain']"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="{ width: width + 'px' }"
        role="tooltip"
        :id="tooltipId"
        :aria-hidden="disabled || !showPopper ? 'true' : 'false'"
      >
        <div class="el-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <span ref="reference">
      <slot name="reference"></slot>
    </span>
  </span>
</template>
<script>
/* fixme: deactivated暂时不知道映射哪钩子，没有加 */
import {
  ref,
  computed,
  toRefs,
  getCurrentInstance,
  watch,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  nextTick
} from 'vue'

import { vuePopperProps, useVuePopper } from './vue-popper'
import { on, off, addClass, removeClass } from '../../src/utils/dom'
import { generateId } from '../../src/utils/util'

export default {
  name: 'ElPopover',

  props: {
    ...vuePopperProps,
    trigger: {
      type: String,
      default: 'click',
      validator: (value) =>
        ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 200
    },
    title: String,
    disabled: Boolean,
    content: String,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'created',
    'show',
    'hide',
    'after-enter',
    'after-leave',
    'update:modelValue'
  ],

  setup(props, { emit, slots }) {
    const { disabled, trigger, reference, popper, tabindex } = toRefs(props)

    const instance = getCurrentInstance()
    const referenceEl = ref(null)
    const { showPopper, destroyPopper } = useVuePopper(props, {
      instance,
      emit,
      slots,
      referenceEl
    })

    const tooltipId = computed(() => `el-popover-${generateId()}`)
    watch(showPopper, (val) => {
      if (disabled.value) return
      val ? emit('show') : emit('hide')
    })

    const {
      doToggle,
      doShow,
      doClose,
      handleFocus,
      handleClick,
      handleBlur,
      handleMouseEnter,
      handleKeydown,
      handleMouseLeave,
      handleDocumentClick,
      handleAfterEnter,
      handleAfterLeave,
      cleanup
    } = useInteractive({
      instance,
      emit,
      slots,
      referenceEl,
      showPopper,
      destroyPopper,
      ...toRefs(props)
    })

    onMounted(() => {
      referenceEl.value =
        (reference && reference.value) || instance.proxy.$refs.reference
      const popperRef = (popper && popper.value) || instance.proxy.$refs.popper
      if (!referenceEl.value && slots.reference && slots.reference()) {
        referenceEl.value = slots.reference()[0].el
      }

      // 可访问性
      if (referenceEl.value) {
        addClass(referenceEl.value, 'el-popover__reference')
        referenceEl.value.setAttribute('aria-describedby', tooltipId.value)
        referenceEl.value.setAttribute('tabindex', tabindex.value) // tab序列
        popperRef.setAttribute('tabindex', 0)

        if (trigger.value !== 'click') {
          on(referenceEl.value, 'focusin', () => {
            handleFocus()
            const instanceRef = referenceEl.value.__vue__
            if (instanceRef && typeof instanceRef.focus === 'function') {
              instanceRef.focus()
            }
          })
          on(popperRef, 'focusin', handleFocus)
          on(referenceEl.value, 'focusout', handleBlur)
          on(popperRef, 'focusout', handleBlur)
        }
        on(referenceEl.value, 'keydown', handleKeydown)
        on(referenceEl.value, 'click', handleClick)
      }
      if (trigger.value === 'click') {
        on(referenceEl.value, 'click', doToggle)
        on(document, 'click', handleDocumentClick)
      } else if (trigger.value === 'hover') {
        on(referenceEl.value, 'mouseenter', handleMouseEnter)
        on(popperRef, 'mouseenter', handleMouseEnter)
        on(referenceEl.value, 'mouseleave', handleMouseLeave)
        on(popperRef, 'mouseleave', handleMouseLeave)
      } else if (trigger.value === 'focus') {
        if (tabindex < 0) {
          console.warn(
            '[Element Warn][Popover]a negative taindex means that the element cannot be focused by tab key'
          )
        }
        if (referenceEl.value.querySelector('input, textarea')) {
          on(referenceEl.value, 'focusin', doShow)
          on(referenceEl.value, 'focusout', doClose)
        } else {
          on(referenceEl.value, 'mousedown', doShow)
          on(referenceEl.value, 'mouseup', doClose)
        }
      }
    })

    onBeforeUnmount(() => {
      cleanup()
    })

    onUnmounted(() => {
      off(referenceEl.value, 'click', doToggle)
      off(referenceEl.value, 'mouseup', doClose)
      off(referenceEl.value, 'mousedown', doShow)
      off(referenceEl.value, 'focusin', doShow)
      off(referenceEl.value, 'focusout', doClose)
      off(referenceEl.value, 'mousedown', doShow)
      off(referenceEl.value, 'mouseup', doClose)
      off(referenceEl.value, 'mouseleave', handleMouseLeave)
      off(referenceEl.value, 'mouseenter', handleMouseEnter)
      off(document, 'click', handleDocumentClick)
    })

    // deactivated(() => {
    //   cleanup()
    // })

    return {
      showPopper,
      doToggle,
      doShow,
      doClose,
      handleFocus,
      handleClick,
      handleBlur,
      handleMouseEnter,
      handleKeydown,
      handleMouseLeave,
      handleDocumentClick,
      handleAfterEnter,
      handleAfterLeave,
      tooltipId,
      cleanup
    }
  }
}

function useInteractive({
  instance,
  showPopper,
  referenceEl,
  trigger,
  popper,
  slots,
  emit,
  destroyPopper,
  openDelay,
  closeDelay,
  reference
}) {
  function doToggle() {
    showPopper.value = !showPopper.value
  }

  function doShow() {
    showPopper.value = true
  }

  function doClose() {
    showPopper.value = false
  }

  function handleFocus() {
    addClass(referenceEl.value, 'focusing')
    if (trigger.value === 'click' || trigger.value === 'focus')
      showPopper.value = true
  }

  function handleClick() {
    removeClass(referenceEl.value, 'focusing')
  }

  function handleBlur() {
    removeClass(referenceEl.value, 'focusing')
    if (trigger.value === 'click' || trigger.value === 'focus')
      showPopper.value = false
  }

  let _timer = null
  function handleMouseEnter() {
    clearTimeout(_timer)
    if (openDelay.value) {
      _timer = setTimeout(() => {
        showPopper.value = true
      }, openDelay.value)
    } else {
      showPopper.value = true
    }
  }

  function handleKeydown(ev) {
    if (ev.keyCode === 27 && trigger.value !== 'manual') {
      doClose()
    }
  }

  function handleMouseLeave() {
    clearTimeout(_timer)
    if (closeDelay.value) {
      _timer = setTimeout(() => {
        showPopper.value = false
      }, closeDelay.value)
    } else {
      showPopper.value = false
    }
  }

  function handleDocumentClick(e) {
    let referenceRef =
      (reference && reference.value) || instance.proxy.$refs.reference
    const popperRef = (popper && popper.value) || instance.proxy.$refs.popper
    const $el = instance.proxy.$el
    if (
      !referenceRef &&
      slots.reference &&
      slots.reference() &&
      slots.reference()[0]
    ) {
      referenceRef = referenceEl = slots.reference()[0].el
    }
    /* fixme: 在eleui官网调试是如下的判定条件 */
    if (
      $el &&
      referenceRef &&
      !$el.contains(e.target) &&
      !referenceRef.contains(e.target) &&
      popperRef &&
      !popperRef.contains(e.target)
    )
      return (showPopper.value = false)
  }

  function handleAfterEnter() {
    nextTick(() => emit('after-enter'))
  }

  function handleAfterLeave() {
    nextTick(() => {
      emit('after-leave')
      destroyPopper()
    })
  }

  function cleanup() {
    if (openDelay.value || closeDelay.value) {
      clearTimeout(_timer)
    }
  }

  return {
    doToggle,
    doShow,
    doClose,
    handleFocus,
    handleClick,
    handleBlur,
    handleMouseEnter,
    handleKeydown,
    handleMouseLeave,
    handleDocumentClick,
    handleAfterEnter,
    handleAfterLeave,
    cleanup
  }
}
</script>
