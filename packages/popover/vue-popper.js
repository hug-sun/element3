import {
  nextTick,
  ref,
  getCurrentInstance,
  onBeforeUnmount,
  watch,
  toRefs
} from 'vue'
import { PopupManager } from '../../src/utils/popup'

// const PopperJS = require('element-ui/src/utils/popper')
import { Popper } from '../../src/utils/new-popper'
// const PopperJS = Vue.prototype.$isServer ? function() {} : require('./popper')
const stop = (e) => e.stopPropagation()

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */

const vuePopperProps = {
  transformOrigin: {
    type: [Boolean, String],
    default: true
  },
  placement: {
    type: String,
    default: 'bottom'
  },
  boundariesPadding: {
    type: Number,
    default: 5
  },
  reference: {},
  popper: {},
  offset: {
    default: 0
  },
  modelValue: Boolean,
  visibleArrow: Boolean,
  arrowOffset: {
    type: Number,
    default: 35
  },
  appendToBody: {
    type: Boolean,
    default: true
  },
  popperOptions: {
    type: Object,
    default() {
      return {
        gpuAcceleration: false
      }
    }
  }
}

function useVuePopper(props, { emit, slots, referenceEl }) {
  const {
    transformOrigin,
    placement,
    reference,
    popper,
    offset,
    modelValue,
    visibleArrow,
    arrowOffset,
    appendToBody,
    popperOptions,
    disabled
  } = toRefs(props)
  const showPopper = ref(false)
  const currentPlacement = ref('')
  const popperElm = ref(null)
  const popperJS = ref(null)
  const instance = getCurrentInstance()

  function createPopper() {
    if (instance.proxy.$isServer) return
    currentPlacement.value = currentPlacement.value || placement.value
    if (
      !/^(top|bottom|left|right)(-start|-end)?$/g.test(currentPlacement.value)
    ) {
      return
    }
    const options = popperOptions.value
    const popperRef = (popperElm.value =
      popperElm.value ||
      (popper && popper.value) ||
      instance.proxy.$refs.popper)

    let referenceRef = (referenceEl.value =
      referenceEl.value ||
      (reference && reference.value) ||
      instance.proxy.$refs.reference)

    if (
      !referenceRef &&
      slots.reference &&
      slots.reference() &&
      slots.reference()[0]
    ) {
      referenceRef = referenceEl.value = slots.reference()[0].el
    }

    if (!popperRef || !referenceRef) return
    if (visibleArrow.value) appendArrow(popperRef)
    if (appendToBody.value) document.body.appendChild(popperElm.value)
    if (popperJS.value && popperJS.value.destroy) {
      popperJS.value.destroy()
    }

    options.placement = currentPlacement.value
    options.offset = offset.value
    options.arrowOffset = arrowOffset.value
    popperJS.value = new Popper(referenceRef, popperRef, options)
    popperJS.value.onCreate(() => {
      emit('created', instance.proxy)
      resetTransformOrigin()
      nextTick(() => updatePopper())
    })
    if (typeof options.onUpdate === 'function') {
      popperJS.value.onUpdate(options.onUpdate)
    }
    popperJS.value._popper.style.zIndex = PopupManager.nextZIndex()
    popperElm.value.addEventListener('click', stop)
  }

  function updatePopper() {
    const popperJSRef = popperJS.value
    if (popperJSRef) {
      popperJSRef.update()
      if (popperJSRef._popper) {
        popperJSRef._popper.style.zIndex = PopupManager.nextZIndex()
      }
    } else {
      createPopper()
    }
  }

  function doDestroy(forceDestroy) {
    /* istanbul ignore if */
    if (!popperJS.value || (showPopper.value && !forceDestroy)) return
    popperJS.value.destroy()
    popperJS.value = null
  }

  function destroyPopper() {
    if (popperJS.value) {
      resetTransformOrigin()
    }
  }

  function resetTransformOrigin() {
    if (!transformOrigin.value) return
    const placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    const placement = popperJS.value._popper
      .getAttribute('x-placement')
      .split('-')[0]
    const origin = placementMap[placement]
    popperJS.value._popper.style.transformOrigin =
      typeof transformOrigin.value === 'string'
        ? transformOrigin.value
        : ['top', 'bottom'].indexOf(placement) > -1
        ? `center ${origin}`
        : `${origin} center`
  }

  const appended = ref(false)
  function appendArrow(element) {
    let hash

    if (appended.value) {
      return
    }

    appended.value = true

    for (const item in element.attributes) {
      if (/^_v-/.test(element.attributes[item].name)) {
        hash = element.attributes[item].name
        break
      }
    }

    const arrow = document.createElement('div')

    if (hash) {
      arrow.setAttribute(hash, '')
    }
    arrow.setAttribute('x-arrow', '')
    arrow.className = 'popper__arrow'
    element.appendChild(arrow)
  }

  watch(
    modelValue,
    (val) => {
      showPopper.value = val
      emit('update:modelValue', val)
    },
    {
      immediate: true
    }
  )

  watch(showPopper, (val) => {
    if (disabled.value) return
    val ? updatePopper() : destroyPopper()
    emit('update:modelValue', val)
  })

  onBeforeUnmount(() => {
    doDestroy(true)
    if (popperElm.value && popperElm.value.parentNode === document.body) {
      popperElm.value.removeEventListener('click', stop)
      document.body.removeChild(popperElm.value)
    }
  })

  return {
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
  }
}

export { vuePopperProps, useVuePopper }
