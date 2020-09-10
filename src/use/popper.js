import {
  ref,
  toRefs,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  watch
} from 'vue'
import { PopupManager } from 'element-ui/src/utils/popup'

const PopperJS = require('element-ui/src/utils/popper')
const stop = (e) => e.stopPropagation()

const popperProps = {
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
  value: Boolean,
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
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
}

const usePopper = (props, { emit, slots, popperElm, referenceElm }) => {
  const {
    placement,
    popperOptions,
    propPopper,
    propReference,
    visibleArrow,
    appendToBody,
    offset,
    arrowOffset,
    transformOrigin,
    value,
    disabled
  } = toRefs(props)
  const instance = getCurrentInstance()

  const showPopper = ref(false)
  const currentPlacement = ref('')
  const popperJS = ref(null)

  const createPopper = () => {
    if (instance.proxy.$isServer) return
    currentPlacement.value = currentPlacement.value || placement.value
    if (
      !/^(top|bottom|left|right)(-start|-end)?$/g.test(currentPlacement.value)
    ) {
      return
    }

    const _options = popperOptions.value
    const _popper = (popperElm.value =
      popperElm.value || propPopper.value || instance.proxy.$refs.reference)

    let _reference = (referenceElm.value =
      referenceElm.value || propReference || instance.proxy.$refs.reference)

    if (
      !_reference &&
      slots.reference &&
      slots.reference() &&
      slots.reference()[0]
    ) {
      _reference = referenceElm.value = slots().reference[0].el
    }

    if (!_popper || !_reference) {
      return
    }
    if (visibleArrow.value) {
      appendArrow(_popper)
    }
    if (appendToBody.value) {
      document.body.appendChild(popperElm.value)
    }
    if (popperJS.value?.destory) {
      popperJS.value.destory()
    }

    _options.placement = currentPlacement.value
    _options.offset = offset.value
    _options.arrowOffset = arrowOffset.value

    popperJS.value = new PopperJS(_reference, _popper, _options)
    popperJS.value.onCreate((_) => {
      emit('created', instance.proxy)
      resetTransformOrigin()
      nextTick(updatePopper)
    })

    if (typeof _options.onUpdate === 'function') {
      popperJS.value.onUpdate(_options.onUpdate)
    }
    popperJS.value._popper.style.zIndex = PopupManager.nextZIndex()
    popperElm.value?.addEventListener('click', stop)
  }

  const updatePopper = () => {
    if (popperJS.value) {
      popperJS.value.update()
      if (popperJS.value._popper) {
        popperJS.value._popper.style.zIndex = PopupManager.nextZIndex()
      }
    } else {
      createPopper()
    }
  }

  const doDestroy = (forceDestroy) => {
    /* istanbul ignore if */
    if (!popperJS.value || (showPopper.value && !forceDestroy)) return
    popperJS.value.destroy()
    popperJS.value = null
  }

  const destroyPopper = () => {
    if (popperJS.value) {
      resetTransformOrigin()
    }
  }

  const resetTransformOrigin = () => {
    if (!transformOrigin.value) return
    const _placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    const _placement = popperJS.value._popper
      .getAttribute('x-placement')
      .split('-')[0]
    const _origin = _placementMap[_placement]
    popperJS.value._popper.style.transformOrigin =
      typeof transformOrigin.value === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(_placement) > -1
        ? `center ${_origin}`
        : `${_origin} center`
  }

  const appended = ref(false)
  const appendArrow = (element) => {
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
    value,
    (val) => {
      showPopper.value = val
      emit('update:value', val)
    },
    { immediate: true }
  )

  watch(showPopper, (val) => {
    if (disabled.value) return
    val ? updatePopper() : destroyPopper()
    emit('update:value', val)
  })

  onBeforeUnmount(() => {
    doDestroy(true)
    if (popperElm.value?.parentNode === document.body) {
      popperElm.value.removeEventListener('click', stop)
      document.body.removeChild(this.popperElm)
    }
  })

  return {
    showPopper,
    currentPlacement,
    popperJS,
    createPopper,
    updatePopper,
    doDestroy,
    destroyPopper,
    resetTransformOrigin,
    appendArrow
  }
}

export { popperProps, usePopper }
