<template>
  <div
    class="el-slider__button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
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
      <span slot="content">{{ formatValue }}</span>
      <div
        class="el-slider__button"
        :class="{ hover: hovering, dragging: dragging }"
      ></div>
    </el-tooltip>
  </div>
</template>

<script>
import ElTooltip from 'element-ui/packages/tooltip'
import {
  reactive,
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
    const { parent, ctx } = getCurrentInstance()
    const { modelValue, vertical } = toRefs(props)
    const state = reactive({
      oldValue: unref(modelValue)
    })

    // computed
    const disabled = computed(() => parent.ctx.sliderDisabled)
    const max = computed(() => parent.ctx.max)
    const min = computed(() => parent.ctx.min)
    const step = computed(() => parent.ctx.step)
    const showTooltip = computed(() => parent.ctx.showTooltip)
    const precision = computed(() => parent.ctx.precision)
    const currentPosition = computed(
      () =>
        `${
          ((unref(modelValue) - unref(min)) / (unref(max) - unref(min))) * 100
        }%`
    )
    const enableFormat = computed(
      () => parent.ctx.formatTooltip instanceof Function
    )
    const formatValue = computed(
      () =>
        (unref(enableFormat) && parent.ctx.formatTooltip(unref(modelValue))) ||
        unref(modelValue)
    )
    const wrapperStyle = computed(() =>
      unref(vertical)
        ? { bottom: unref(currentPosition) }
        : { left: unref(currentPosition) }
    )

    const { hovering, handleMouseEnter, handleMouseLeave } = useMouseHover(
      displayTooltip,
      hideTooltip
    )

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
      // methods
      onButtonDown,
      onDragStart,
      onDragging,
      onDragEnd,
      onLeftKeyDown,
      onRightKeyDown
    } = useDragAndKeyDown(
      vertical,
      disabled,
      step,
      max,
      min,
      currentPosition,
      displayTooltip,
      hideTooltip,
      setPosition
    )

    // watch
    watch(dragging, (val) => (parent.ctx.dragging = val))

    // methods
    function displayTooltip() {
      ctx.$refs.tooltip && (ctx.$refs.tooltip.showPopper = true)
    }

    function hideTooltip() {
      ctx.$refs.tooltip && (ctx.$refs.tooltip.showPopper = false)
    }

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
        displayTooltip()
        ctx.$refs.tooltip && ctx.$refs.tooltip.updatePopper()
      })
      if (!unref(dragging) && unref(modelValue) !== state.oldValue) {
        state.oldValue = value
      }
    }

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
      ...toRefs(state),
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
      onRightKeyDown
    }
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
  vertical,
  disabled,
  step,
  max,
  min,
  currentPosition,
  displayTooltip,
  hideTooltip,
  setPosition
) {
  const { parent } = getCurrentInstance()
  const { resetSize, emitChange } = parent.ctx

  const dragging = ref(false)
  const isClick = ref(false)
  const startX = ref(0)
  const currentX = ref(0)
  const startY = ref(0)
  const currentY = ref(0)
  const startPosition = ref(0)
  const newPosition = ref(null)

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
        diff = ((startY.value - currentY.value) / parent.ctx.sliderSize) * 100
      } else {
        currentX.value = event.clientX
        diff = ((currentX.value - startX.value) / parent.ctx.sliderSize) * 100
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
  return {
    dragging,
    isClick,
    startX,
    currentX,
    startY,
    currentY,
    startPosition,
    newPosition,

    // methods
    onButtonDown,
    onDragStart,
    onDragging,
    onDragEnd,
    onLeftKeyDown,
    onRightKeyDown
  }
}
</script>
