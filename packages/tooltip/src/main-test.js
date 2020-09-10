import { vuePopperProps, useVuePopper } from 'packages/popover/vue-popper'
import debounce from 'throttle-debounce/debounce'
import { addClass, removeClass, on, off } from 'element-ui/src/utils/dom'
import { generateId } from 'element-ui/src/utils/util'
// eslint-disable-next-line
import { h, createApp, ref, watch, watchEffect, onMounted, getCurrentInstance, Transition } from 'vue'

export default {
    name: 'ElTooltip',
    emits: ['input', 'update:modelValue'],

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
        let timeoutPending = ref(null)
        let timeout = ref(null)
        let focusing = ref(false)
        let expectedState = ref(false)
        let referenceElm = ref(null)
        const { emit, slots } = context
        const {
            openDelay,
            disabled,
            manual,
            effect,
            popperClass,
            content,
            transition,
            enterable,
            hideAfter,
            tabindex,
        } = props
        let {
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
        } = useVuePopper(props, { emit,  slots, referenceEl: referenceElm})
        
        const instance = getCurrentInstance()
        const tooltipId = `el-tooltip-${generateId()}`
        const debounceClose = debounce(200, () => handleClosePopper())

        const show = () => {
            debugger
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

        watch(focusing, (val, old) => {
            if (val) {
                addClass(referenceElm.value, 'focusing')
            } else {
                removeClass(referenceElm.value, 'focusing')
            }
        })

        watchEffect(() => {
            // debugger
            const popperVM = createApp({
                setup() {
                    console.log('setup')
                    const popperInstance = getCurrentInstance()

                    onMounted(() => {
                        console.log('popperVM-onMounted')
                        popperElm.value = popperInstance.ctx.$refs.popper
                    })

                    return () => {
                        return (<Transition name={transition} onAfterLeave={doDestroy}>
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
                                    class={[
                                        'el-tooltip__popper',
                                        'is-' + effect,
                                        popperClass
                                    ]}
                                >
                                    {slots.content ? slots.content() : content}
                                </div>
                        </Transition>)
                    }
                }
            })
            if (!disabled && showPopper.value) {
                const divDom = document.createElement('div');
                popperVM.mount(divDom);
            }
            // document.body.appendChild(divDom);
            console.log(popperVM, 'popperVM')
            // debugger

        })

        onMounted(() => {
            debugger
            referenceElm.value = instance.ctx.$el
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
        })

        return () => {
            const firstElement = getFirstElement()
            if (!firstElement) return null

            const firstElementProps = (firstElement.props = firstElement.props || {})
            firstElementProps.class = addTooltipClass(firstElementProps.class)

            return firstElement
        }
    }
}
