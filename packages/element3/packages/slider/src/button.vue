<template>
  <div
    class="el-slider__button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart.passive="onButtonDown"
    :class="{ hover: hovering, dragging: dragging }"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
  >
    <el-tooltip
      placement="top"
      ref="tooltip"
      :popper-class="tooltipClass"
      :disabled="!showTooltip"
    >
      <template v-slot:content>
        <span>{{ formatValue }}</span>
      </template>
      <div
        class="el-slider__button"
        :class="{ hover: hovering, dragging: dragging }"
      ></div>
    </el-tooltip>
  </div>
</template>

<script>
import ElTooltip from '../../tooltip'
import {
  computed,
  ref,
  unref,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick
} from 'vue'

export default {
  name: 'ElSliderButton',

  components: {
    ElTooltip
  },

  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const tooltip = ref(null)

    const { parent, proxy } = getCurrentInstance()

    const { modelValue, vertical } = toRefs(props)

    const { displayTooltip, hideTooltip } = useToolTip(proxy)

    const { hovering, handleMouseEnter, handleMouseLeave } = useMouseHover(
      displayTooltip,
      hideTooltip
    )

    // computed
    const {
      disabled,
      max,
      min,
      step,
      showTooltip,
      precision,
      currentPosition,
      enableFormat,
      formatValue,
      wrapperStyle
    } = useComputed(modelValue, vertical)

    const {
      // data
      dragging,
      isClick,
      startX,
      currentX,
      startY,
      currentY,
      startPosition,
      newPosition,
      oldValue,
      // methods
      onButtonDown,
      onDragStart,
      onDragging,
      onDragEnd,
      onLeftKeyDown,
      onRightKeyDown,
      setPosition
    } = useDragAndKeyDown(
      parent,
      proxy,
      emit,
      modelValue,
      vertical,
      disabled,
      step,
      max,
      min,
      precision,
      currentPosition,
      displayTooltip,
      hideTooltip
    )

    return {
      // data
      hovering,
      dragging,
      isClick,
      startX,
      currentX,
      startY,
      currentY,
      startPosition,
      newPosition,
      oldValue,
      // computed
      disabled,
      max,
      min,
      step,
      showTooltip,
      precision,
      currentPosition,
      enableFormat,
      formatValue,
      wrapperStyle,
      // methods
      setPosition,
      handleMouseEnter,
      handleMouseLeave,
      onButtonDown,
      onDragStart,
      onDragging,
      onDragEnd,
      onLeftKeyDown,
      onRightKeyDown,
      // ref
      tooltip
    }
  }
}

function useToolTip(proxy) {
  function displayTooltip() {
    proxy.tooltip && (proxy.tooltip.showPopper = true)
  }

  function hideTooltip() {
    proxy.tooltip && (proxy.tooltip.showPopper = false)
  }
  return {
    displayTooltip,
    hideTooltip
  }
}

function useMouseHover(displayTooltip, hideTooltip) {
  const hovering = ref(false)
  function handleMouseEnter() {
    hovering.value = true
    displayTooltip()
  }

  function handleMouseLeave() {
    hovering.value = false
    hideTooltip()
  }
  return { hovering, handleMouseEnter, handleMouseLeave }
}

function useDragAndKeyDown(
  parent,
  proxy,
  emit,
  modelValue,
  vertical,
  disabled,
  step,
  max,
  min,
  precision,
  currentPosition,
  displayTooltip,
  hideTooltip
) {
  const { resetSize, emitChange } = parent.proxy

  const dragging = ref(false)
  const isClick = ref(false)
  const startX = ref(0)
  const currentX = ref(0)
  const startY = ref(0)
  const currentY = ref(0)
  const startPosition = ref(0)
  const newPosition = ref(null)
  const oldValue = ref(unref(modelValue))
  // watch
  watch(dragging, (val) => (parent.proxy.dragging = val))

  // eslint-disable-next-line
  //#region drag methods: onButtonDown, onDragStart, onDragging, onDragEnd

  function onButtonDown(event) {
    if (unref(disabled)) return
    event.preventDefault()
    onDragStart(event)
    window.addEventListener('mousemove', onDragging)
    window.addEventListener('touchmove', onDragging)
    window.addEventListener('mouseup', onDragEnd)
    window.addEventListener('touchend', onDragEnd)
    window.addEventListener('contextmenu', onDragEnd)
  }

  function onDragStart(event) {
    dragging.value = true
    isClick.value = true
    if (event.type === 'touchstart') {
      event.clientY = event.touches[0].clientY
      event.clientX = event.touches[0].clientX
    }
    if (unref(vertical)) {
      startY.value = event.clientY
    } else {
      startX.value = event.clientX
    }
    startPosition.value = parseFloat(unref(currentPosition))
    newPosition.value = unref(startPosition)
  }

  function onDragging(event) {
    if (unref(dragging)) {
      isClick.value = false
      displayTooltip()
      resetSize()
      let diff = 0
      if (event.type === 'touchmove') {
        event.clientY = event.touches[0].clientY
        event.clientX = event.touches[0].clientX
      }
      if (unref(vertical)) {
        currentY.value = event.clientY
        diff = ((startY.value - currentY.value) / parent.proxy.sliderSize) * 100
      } else {
        currentX.value = event.clientX
        diff = ((currentX.value - startX.value) / parent.proxy.sliderSize) * 100
      }
      newPosition.value = unref(startPosition) + diff
      setPosition(unref(newPosition))
    }
  }

  function onDragEnd() {
    if (unref(dragging)) {
      /*
       * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
       * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
       */
      setTimeout(() => {
        dragging.value = false
        hideTooltip()
        if (!isClick.value) {
          setPosition(unref(newPosition))
          emitChange()
        }
      }, 0)
      window.removeEventListener('mousemove', onDragging)
      window.removeEventListener('touchmove', onDragging)
      window.removeEventListener('mouseup', onDragEnd)
      window.removeEventListener('touchend', onDragEnd)
      window.removeEventListener('contextmenu', onDragEnd)
    }
  }
  // eslint-disable-next-line
  //#endregion

  // eslint-disable-next-line
  //#region KeyDown methods: onLeftKeyDown, onRightKeyDown

  function onLeftKeyDown() {
    if (unref(disabled)) return
    newPosition.value =
      parseFloat(unref(currentPosition)) -
      (unref(step) / (unref(max) - unref(min))) * 100
    setPosition(unref(newPosition))
    emitChange()
  }
  function onRightKeyDown() {
    if (unref(disabled)) return
    newPosition.value =
      parseFloat(unref(currentPosition)) +
      (unref(step) / (unref(max) - unref(min))) * 100
    setPosition(unref(newPosition))
    emitChange()
  }

  // eslint-disable-next-line
  //#endregion

  function setPosition(newPosition) {
    if (newPosition === null || isNaN(newPosition)) return
    if (newPosition < 0) {
      newPosition = 0
    } else if (newPosition > 100) {
      newPosition = 100
    }
    const lengthPerStep = 100 / ((max.value - min.value) / step.value)
    const steps = Math.round(newPosition / lengthPerStep)
    let value =
      steps * lengthPerStep * (max.value - min.value) * 0.01 + min.value
    value = parseFloat(value.toFixed(precision.value))
    emit('update:modelValue', value)
    nextTick(() => {
      //console.log(proxy.tooltip);
      proxy.tooltip && proxy.tooltip.updatePopper()
    })
    if (!unref(dragging) && unref(modelValue) !== unref(oldValue)) {
      oldValue.value = value
    }
  }

  return {
    dragging,
    isClick,
    startX,
    currentX,
    startY,
    currentY,
    startPosition,
    newPosition,
    oldValue,
    // methods
    setPosition,
    onButtonDown,
    onDragStart,
    onDragging,
    onDragEnd,
    onLeftKeyDown,
    onRightKeyDown
  }
}

function useComputed(modelValue, vertical) {
  const { parent } = getCurrentInstance()

  const disabled = computed(() => parent.proxy.sliderDisabled)
  const max = computed(() => parent.proxy.max)
  const min = computed(() => parent.proxy.min)
  const step = computed(() => parent.proxy.step)
  const showTooltip = computed(() => parent.proxy.showTooltip)
  const precision = computed(() => parent.proxy.precision)
  const currentPosition = computed(
    () =>
      `${((unref(modelValue) - unref(min)) / (unref(max) - unref(min))) * 100}%`
  )
  const enableFormat = computed(
    () => parent.proxy.formatTooltip instanceof Function
  )
  const formatValue = computed(
    () =>
      (unref(enableFormat) && parent.proxy.formatTooltip(unref(modelValue))) ||
      unref(modelValue)
  )
  const wrapperStyle = computed(() =>
    unref(vertical)
      ? { bottom: unref(currentPosition) }
      : { left: unref(currentPosition) }
  )
  return {
    disabled,
    max,
    min,
    step,
    showTooltip,
    precision,
    currentPosition,
    enableFormat,
    formatValue,
    wrapperStyle
  }
}
</script>
