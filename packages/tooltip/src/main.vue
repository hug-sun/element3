<template>
  <slot name="default" :class="className">
  </slot>
  <teleport to="body">
    <transition :name="transition" @after-leave="doDestroy">
      <div
        @mouseleave="mouseleaveHandler"
        @mouseenter="mouseenterHandler"
        ref="popper"
        role="tooltip"
        :id="tooltipId"
        :aria-hidden="disabled || !showPopper ? 'true' : 'false'"
        v-show="!disabled && showPopper"
        :class="[
          'el-tooltip__popper',
          'is-' + effect,
          popperClass
        ]"
      >
        <slot name="content" v-if="slots.content"></slot>
        <template v-else>{{ content }}</template>
      </div>
    </transition>
  </teleport>
</template>
<script>
import { vuePopperProps, useVuePopper } from 'packages/popover/vue-popper'
import debounce from 'throttle-debounce/debounce'
import { addClass, removeClass, on } from 'element-ui/src/utils/dom'
import { generateId } from 'element-ui/src/utils/util'
import {
  h,
  watch,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  getCurrentInstance
} from 'vue'

export default {
  name: 'ElTooltip',
  emits: ['input', 'update:modelValue'],
  props: {
    ...vuePopperProps,
    className: {
      type: String,
      default: ''
    },
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        }
      }
    },
    enterable: {
      type: Boolean,
      default: true
    },
    hideAfter: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const {
      value,
      transition,
      content,
      disabled,
      manual,
      effect,
      popperClass,
      enterable,
      tabindex
    } = props
    const { slots } = context

    // if (Array.isArray(slots.default())) {
    //   slots.default().forEach((slot) => {
    //     console.log( h(slot) )
    //   })
    // }
    // if (slots.content) {
    //   console.log(slots.content(), 'slots.content')
    // }
    const {
      showPopper,
      currentPlacement,
      popperElm,
      popperJS,
      createPopper,
      updatePopper,
      doDestroy,
      destroyPopper,
      resetTransformOrigin,
      appendArrow
    } = useVuePopper(props, context)

    const tooltipId = `el-tooltip-${generateId()}`
    let timeoutPending = null
    let focusing = false
    let expectedState = false
    const debounceClose = debounce(200, () => handleClosePopper())
    let timeout = null
    const currentInstance = getCurrentInstance()

    watch(
      () => focusing,
      (val) => {
        if (val) {
          addClass(this.referenceElm, 'focusing')
        } else {
          removeClass(this.referenceElm, 'focusing')
        }
      }
    )

    const mouseleaveHandler = () => {
      setExpectedState(false)
      debounceClose()
    }
    const mouseenterHandler = () => {
      setExpectedState(true)
    }

    const show = () => {
      setExpectedState(true)
      handleShowPopper()
    }

    const hide = () => {
      setExpectedState(false)
      debounceClose()
    }

    const handleFocus = () => {
      focusing = true
      show()
    }

    const handleBlur = () => {
      focusing = false
      hide()
    }
    const removeFocusing = () => {
      focusing = false
    }

    // const addTooltipClass = (prev) => {
    //   if (!prev) {
    //     return 'el-tooltip'
    //   } else {
    //     return 'el-tooltip ' + prev.replace('el-tooltip', '')
    //   }
    // }

    const handleShowPopper = () => {
      const { ctx } = currentInstance
      if (!expectedState || manual) return
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        ctx.showPopper = true
      }, openDelay)

      if (hideAfter > 0) {
        timeoutPending = setTimeout(() => {
          ctx.showPopper = false
        }, hideAfter)
      }
    }

    const handleClosePopper = () => {
      const { ctx } = currentInstance
      if ((enterable && expectedState) || manual) return
      clearTimeout(timeout)

      if (timeoutPending) {
        clearTimeout(timeoutPending)
      }
      ctx.showPopper = false

      if (disabled) {
        doDestroy()
      }
    }

    const setExpectedState = (expectedState) => {
      if (expectedState === false) {
        clearTimeout(timeoutPending)
      }
      expectedState = expectedState
    }

    const getFirstElement = () => {
      const slots = slots.default()
      if (!Array.isArray(slots)) return null
      let element = null
      for (let index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index]
        }
      }
      return element
    }

    onMounted(() => {
      let referenceElm = currentInstance.vnode.el
      if (referenceElm.nodeType === 1) {
        referenceElm.setAttribute('aria-describedby', tooltipId)
        referenceElm.setAttribute('tabindex', tabindex)
        //   on(referenceElm, 'mouseenter', show)
        //   on(referenceElm, 'mouseleave', hide)
        on(referenceElm, 'focus', () => {
          if (!slots.default() || !slots.default().length) {
            handleFocus()
            return
          }
          const instance = slots.default()[0].componentInstance
          if (instance && instance.focus) {
            instance.focus()
          } else {
            handleFocus()
          }
        })
        //   on(referenceElm, 'blur', handleBlur)
        //   on(referenceElm, 'click', removeFocusing)
      }
      // fix issue https://github.com/ElemeFE/element/issues/14424
      // if (this.value && this.popperVM) {
      //   this.popperVM.$nextTick(() => {
      //     if (this.value) {
      //       this.updatePopper()
      //     }
      //   })
      // }
    })

    onBeforeUnmount(() => {})

    onUnmounted(() => {})

    return {
      className: context.attrs.class,
      slots,
      mouseleaveHandler,
      mouseenterHandler,
      show,
      hide,
      handleBlur,
      removeFocusing,
      transition,
      doDestroy,
      tooltipId,
      disabled,
      showPopper,
      effect,
      popperClass
    }
  }
}
</script>