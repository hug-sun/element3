import { vuePopperProps, useVuePopper } from '../popover/vue-popper'

import { debounce } from 'throttle-debounce'
import { addClass, removeClass, on, off } from '../../src/utils/dom'
import { generateId } from '../../src/utils/util'
// eslint-disable-next-line
import {
  createApp,
  ref,
  watch,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  Transition,
  onBeforeMount
} from 'vue'

export default {
  name: 'ElTooltip',
  emits: ['input', 'update:modelValue', 'created'],
  props: {
    ...vuePopperProps,
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
    content: {
      type: String,
      default: 'dark'
    },
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
  beforeCreate() {
    if (this.$isServer) return

    this.popperVM = createApp({
      data() {
        return {
          node: ''
        }
      },
      render() {
        return this.node
      }
    }).mount(document.createElement('div'))
  },
  setup(props, context) {
    const timeoutPending = ref(null)
    const timeout = ref(null)
    const focusing = ref(false)
    const expectedState = ref(false)
    const referenceElm = ref(null)
    const { emit, slots } = context
    const {
      modelValue,
      openDelay,
      disabled,
      manual,
      effect,
      popperClass,
      transition,
      enterable,
      hideAfter,
      tabindex
    } = props
    const { showPopper, updatePopper, doDestroy } = useVuePopper(props, {
      emit,
      slots,
      referenceEl: referenceElm
    })

    const instance = getCurrentInstance()
    const tooltipId = `el-tooltip-${generateId()}`
    const debounceClose = debounce(200, () => handleClosePopper())

    const show = () => {
      setExpectedState(true)
      handleShowPopper()
    }

    const hide = () => {
      setExpectedState(false)
      debounceClose()
    }

    const handleFocus = () => {
      focusing.value = true
      show()
    }

    const handleBlur = () => {
      focusing.value = false
      hide()
    }

    const removeFocusing = () => {
      focusing.value = false
    }

    const addTooltipClass = (prev) => {
      if (!prev) {
        return 'el-tooltip'
      } else {
        return 'el-tooltip ' + prev.replace('el-tooltip', '')
      }
    }

    const handleShowPopper = () => {
      if (!expectedState.value || manual) return
      clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        showPopper.value = true
      }, openDelay)

      if (hideAfter > 0) {
        timeoutPending.value = setTimeout(() => {
          showPopper.value = false
        }, hideAfter)
      }
    }

    const handleClosePopper = () => {
      if ((enterable && expectedState.value) || manual) return
      clearTimeout(timeout.value)

      if (timeoutPending.value) {
        clearTimeout(timeoutPending.value)
      }
      showPopper.value = false

      if (disabled) {
        doDestroy()
      }
    }

    const setExpectedState = (state) => {
      if (state === false) {
        clearTimeout(timeoutPending.value)
      }
      expectedState.value = state
    }

    const getFirstElement = () => {
      const slotsDefault = slots.default()
      if (!Array.isArray(slotsDefault)) return null
      let element = null
      for (let index = 0; index < slotsDefault.length; index++) {
        if (slotsDefault[index] && slotsDefault[index].type) {
          element = slotsDefault[index]
        }
      }
      return element
    }

    watch(focusing, (val) => {
      if (val) {
        addClass(referenceElm.value, 'focusing')
      } else {
        removeClass(referenceElm.value, 'focusing')
      }
    })
    onMounted(() => {
      referenceElm.value = instance.proxy.$el
      if (referenceElm.value.nodeType === 1) {
        referenceElm.value.setAttribute('aria-describedby', tooltipId)
        referenceElm.value.setAttribute('tabindex', tabindex)
        on(referenceElm.value, 'mouseenter', show)
        on(referenceElm.value, 'mouseleave', hide)
        on(referenceElm.value, 'focus', () => {
          if (!slots.default || !slots.default().length) {
            handleFocus()
            return
          }
          const slotsProps = slots.default()[0].props

          if (slotsProps && slotsProps.onFocus) {
            slotsProps.onFocus()
          } else {
            handleFocus()
          }
        })
        on(referenceElm.value, 'blur', handleBlur)
        on(referenceElm.value, 'click', removeFocusing)
      }
      // fix issue https://github.com/ElemeFE/element/issues/14424
      if (modelValue && instance.proxy.popperVM) {
        instance.proxy.popperVM.$nextTick(() => {
          if (modelValue) {
            updatePopper()
          }
        })
      }
    })
    onBeforeMount(() => {
      instance.proxy.updatePopper = updatePopper
    })
    onUnmounted(() => {
      const reference = referenceElm.value
      if (reference.nodeType === 1) {
        off(reference, 'mouseenter', show)
        off(reference, 'mouseleave', hide)
        off(reference, 'focus', handleFocus)
        off(reference, 'blur', handleBlur)
        off(reference, 'click', removeFocusing)
      }
    })

    return () => {
      if (instance.proxy.popperVM) {
        instance.proxy.popperVM.node = (
          <Transition name={transition} onAfterLeave={doDestroy}>
            <div
              onMouseleave={() => {
                setExpectedState(false)
                debounceClose()
              }}
              onMouseenter={() => {
                setExpectedState(true)
              }}
              ref="popper"
              role="tooltip"
              id={tooltipId}
              aria-hidden={disabled || !showPopper.value ? 'true' : 'false'}
              v-show={!disabled && showPopper.value}
              class={['el-tooltip__popper', 'is-' + effect, popperClass]}
            >
              {slots.content ? slots.content() : instance.proxy.content}
            </div>
          </Transition>
        )
      }

      const firstElement = getFirstElement()
      if (!firstElement) return null

      const firstElementProps = (firstElement.props = firstElement.props || {})
      firstElementProps.class = addTooltipClass(firstElementProps.class)

      return firstElement
    }
  }
}
