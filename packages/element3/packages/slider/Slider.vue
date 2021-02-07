<template>
  <div
    class="el-slider"
    :class="{ 'is-vertical': vertical, 'el-slider--with-input': showInput }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :aria-disabled="sliderDisabled"
  >
    <el-input-number
      v-model="firstValue"
      v-if="showInput && !range"
      class="el-slider__input"
      ref="input"
      @change="emitChange"
      :step="step"
      :disabled="sliderDisabled"
      :controls="showInputControls"
      :min="min"
      :max="max"
      :debounce="debounce"
      :size="inputSize"
    ></el-input-number>
    <div
      class="el-slider__runway"
      :class="{ 'show-input': showInput, disabled: sliderDisabled }"
      :style="runwayStyle"
      @click="onSliderClick"
      ref="slider"
    >
      <div class="el-slider__bar" :style="barStyle"></div>
      <slider-button
        v-model="firstValue"
        :vertical="vertical"
        :tooltip-class="tooltipClass"
        ref="button1"
      ></slider-button>
      <slider-button
        :vertical="vertical"
        v-model="secondValue"
        :tooltip-class="tooltipClass"
        ref="button2"
        v-if="range"
      ></slider-button>
      <template v-if="showStops">
        <div
          class="el-slider__stop"
          v-for="(item, key) in stops"
          :key="key"
          :style="getStopStyle(item)"
        ></div>
      </template>
      <template v-if="markList.length > 0">
        <div>
          <div
            v-for="(item, key) in markList"
            :style="getStopStyle(item.position)"
            class="el-slider__stop el-slider__marks-stop"
            :key="key"
          ></div>
        </div>
        <div class="el-slider__marks">
          <slider-marker
            :mark="item.mark"
            v-for="(item, key) in markList"
            :key="key"
            :style="getStopStyle(item.position)"
          ></slider-marker>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/babel">
import ElInputNumber from '../input-number'
import SliderButton from './src/button.vue'
import SliderMarker from './src/marker'
import { useEmitter } from '../../src/composables/emitter'
import { isUndefined } from '../../src/utils/types'

import {
  reactive,
  inject,
  computed,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  onBeforeUnmount,
  unref
} from 'vue'

export default {
  name: 'ElSlider',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: [Number, Array],
      default: 0
    },
    showInput: {
      type: Boolean,
      default: false
    },
    showInputControls: {
      type: Boolean,
      default: true
    },
    inputSize: {
      type: String,
      default: 'small'
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String
    },
    tooltipClass: String,
    marks: Object
  },

  components: {
    ElInputNumber,
    SliderButton,
    SliderMarker
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    // data
    const state = reactive({
      firstValue: null,
      secondValue: null,
      oldValue: null,
      dragging: false,
      sliderSize: 1
    })
    const { resetSize } = useCommon(props, state, proxy)

    useLifeCycle(props, state, proxy, resetSize)

    const { minValue, maxValue, valueChanged, setValues } = useModel(
      props,
      state,
      emit
    )

    const {
      stops,
      markList,
      barSize,
      barStart,
      precision,
      runwayStyle,
      barStyle,
      sliderDisabled,
      getStopStyle
    } = useStyle(props, state, minValue, maxValue)

    const { onSliderClick, emitChange, setPosition } = useEvent(
      props,
      state,
      proxy,
      emit,
      minValue,
      maxValue,
      sliderDisabled,
      resetSize
    )

    return {
      // data
      ...toRefs(state),
      // // computed
      minValue,
      maxValue,
      stops,
      markList,
      barSize,
      barStart,
      precision,
      runwayStyle,
      barStyle,
      sliderDisabled,
      // method
      valueChanged,
      setValues,
      setPosition,
      onSliderClick,
      resetSize,
      emitChange,
      getStopStyle
    }
  }
}

function useCommon(props, state, proxy) {
  const { vertical } = toRefs(props)
  function resetSize() {
    const slider = proxy.$refs.slider
    if (slider) {
      state.sliderSize = slider[`client${unref(vertical) ? 'Height' : 'Width'}`]
    }
  }
  return {
    resetSize
  }
}

function useLifeCycle(props, state, proxy, resetSize) {
  const { max, min, modelValue, range, label } = props
  let valuetext
  if (range) {
    if (Array.isArray(modelValue)) {
      state.firstValue = Math.max(min, modelValue[0])
      state.secondValue = Math.min(max, modelValue[1])
    } else {
      state.firstValue = min
      state.secondValue = max
    }
    state.oldValue = [state.firstValue, state.secondValue]
    valuetext = `${state.firstValue}-${state.secondValue}`
  } else {
    if (typeof modelValue !== 'number' || isNaN(modelValue)) {
      state.firstValue = min
    } else {
      state.firstValue = Math.min(max, Math.max(min, modelValue))
    }
    state.oldValue = state.firstValue
    valuetext = state.firstValue
  }
  onMounted(() => {
    proxy.$el.setAttribute('aria-valuetext', valuetext)

    // label screen reader
    proxy.$el.setAttribute(
      'aria-label',
      // eslint-disable-next-line
      label ? label : `slider between ${min} and ${max}`
    )
    resetSize()
    window.addEventListener('resize', resetSize)
  })
  onBeforeUnmount(() => window.removeEventListener('resize', resetSize))
}

function useModel(props, state, emit) {
  const { dispatch } = useEmitter()
  const { max, min, modelValue, range } = toRefs(props)

  const minValue = computed(() => Math.min(state.firstValue, state.secondValue))
  const maxValue = computed(() => Math.max(state.firstValue, state.secondValue))

  // watch
  watch(modelValue, (val, oldVal) => {
    if (
      state.dragging ||
      (Array.isArray(val) &&
        Array.isArray(oldVal) &&
        val.every((item, index) => item === oldVal[index]))
    ) {
      return
    }
    setValues()
  })
  watch(
    () => state.dragging,
    (val) => !val && setValues()
  )
  watch(
    () => state.firstValue,
    (val) =>
      unref(range)
        ? emit('update:modelValue', [unref(minValue), unref(maxValue)])
        : emit('update:modelValue', val)
  )
  watch(
    () => state.secondValue,
    () =>
      unref(range) &&
      emit('update:modelValue', [unref(minValue), unref(maxValue)])
  )
  watch(min, () => setValues())
  watch(max, () => setValues())

  function valueChanged() {
    if (unref(range)) {
      return ![minValue, maxValue].every(
        (item, index) => unref(item) === state.oldValue[index]
      )
    } else {
      return unref(modelValue) !== state.oldValue
    }
  }

  function setValues() {
    const _max = unref(max)
    const _min = unref(min)
    if (_min > _max) {
      console.error(
        '[Element Error][Slider]min should not be greater than max.'
      )
      return
    }
    const val = unref(modelValue)
    if (unref(range) && Array.isArray(val)) {
      if (val[1] < _min) {
        emit('update:modelValue', [_min, _min])
      } else if (val[0] > _max) {
        emit('update:modelValue', [_max, _max])
      } else if (val[0] < _min) {
        emit('update:modelValue', [_min, val[1]])
      } else if (val[1] > _max) {
        emit('update:modelValue', [val[0], _max])
      } else {
        state.firstValue = val[0]
        state.secondValue = val[1]
        if (valueChanged()) {
          dispatch('ElFormItem', 'el.form.change', [
            unref(minValue),
            unref(maxValue)
          ])
          state.oldValue = val.slice()
        }
      }
    } else if (!unref(range) && typeof val === 'number' && !isNaN(val)) {
      if (val < _min) {
        emit('update:modelValue', _min)
      } else if (val > _max) {
        emit('update:modelValue', _max)
      } else {
        state.firstValue = val
        if (valueChanged()) {
          dispatch('ElFormItem', 'el.form.change', val)
          state.oldValue = val
        }
      }
    }
  }
  return {
    minValue,
    maxValue,
    valueChanged,
    setValues
  }
}

function useEvent(
  props,
  state,
  proxy,
  emit,
  minValue,
  maxValue,
  sliderDisabled,
  resetSize
) {
  // const { emit, proxy, props } = getCurrentInstance()
  const { modelValue, range, vertical, min, max } = toRefs(props)

  function onSliderClick(event) {
    if (unref(sliderDisabled) || state.dragging) return
    resetSize()
    const slider = proxy.$refs.slider
    if (unref(vertical)) {
      const sliderOffsetBottom = slider.getBoundingClientRect().bottom
      setPosition(
        ((sliderOffsetBottom - event.clientY) / state.sliderSize) * 100
      )
    } else {
      const sliderOffsetLeft = slider.getBoundingClientRect().left
      setPosition(((event.clientX - sliderOffsetLeft) / state.sliderSize) * 100)
    }
    emitChange()
  }

  function emitChange() {
    nextTick(() =>
      emit(
        'change',
        unref(range) ? [unref(minValue), unref(maxValue)] : unref(modelValue)
      )
    )
  }

  function setPosition(percent) {
    const targetValue = unref(min) + (percent * (unref(max) - unref(min))) / 100
    if (!unref(range)) {
      proxy.$refs.button1.setPosition(percent)
      return
    }
    let button
    if (
      Math.abs(unref(minValue) - targetValue) <
      Math.abs(unref(maxValue) - targetValue)
    ) {
      button = state.firstValue < state.secondValue ? 'button1' : 'button2'
    } else {
      button = state.firstValue > state.secondValue ? 'button1' : 'button2'
    }
    proxy.$refs[button].setPosition(percent)
  }

  return {
    onSliderClick,
    emitChange,
    setPosition
  }
}

function useStyle(props, state, minValue, maxValue) {
  const elForm = inject('elFrom', { default: '' })
  const {
    disabled,
    height,
    showStops,
    min,
    max,
    step,
    range,
    marks,
    vertical
  } = toRefs(props)
  const stops = computed(() => {
    if (!unref(showStops) || unref(min) > unref(max)) return []
    if (unref(step) === 0) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('[Element Warn][Slider]step should not be 0.')
      return []
    }

    const stopCount = (unref(max) - unref(min)) / unref(step)
    const stepWidth = (100 * unref(step)) / (unref(max) - unref(min))
    const result = []
    for (let i = 1; i < stopCount; i++) {
      result.push(i * stepWidth)
    }
    if (unref(range)) {
      return result.filter((step) => {
        return (
          step <
            (100 * (unref(minValue) - unref(min))) /
              (unref(max) - unref(min)) ||
          step >
            (100 * (unref(maxValue) - unref(min))) / (unref(max) - unref(min))
        )
      })
    } else {
      return result.filter(
        (step) =>
          step >
          (100 * (state.firstValue - unref(min))) / (unref(max) - unref(min))
      )
    }
  })
  const markList = computed(() => {
    if (!unref(marks)) {
      return []
    }

    const marksKeys = Object.keys(unref(marks))
    return marksKeys
      .map(parseFloat)
      .sort((a, b) => a - b)
      .filter((point) => point <= unref(max) && point >= unref(min))
      .map((point) => ({
        point,
        position: ((point - unref(min)) * 100) / (unref(max) - unref(min)),
        mark: marks.value[point]
      }))
  })
  const barSize = computed(() => {
    return unref(range)
      ? `${
          (100 * (unref(maxValue) - unref(minValue))) /
          (unref(max) - unref(min))
        }%`
      : `${
          (100 * (state.firstValue - unref(min))) / (unref(max) - unref(min))
        }%`
  })
  const barStart = computed(() => {
    return unref(range)
      ? `${(100 * (unref(minValue) - unref(min))) / (unref(max) - unref(min))}%`
      : '0%'
  })
  const precision = computed(() => {
    const precisions = [min, max, step].map((item) => {
      const decimal = ('' + unref(item)).split('.')[1]
      return decimal ? decimal.length : 0
    })
    return Math.max.apply(null, precisions)
  })
  const runwayStyle = computed(() => {
    if (unref(vertical) && isUndefined(height)) {
      process.env.NODE_ENV !== 'production' &&
        console.warn(
          '[Element Warn][Slider]height must has a value when vertical is true'
        )
      return {}
    }
    return unref(vertical) ? { height: unref(height) } : {}
  })
  const barStyle = computed(() => {
    return unref(vertical)
      ? {
          height: unref(barSize),
          bottom: unref(barStart)
        }
      : {
          width: unref(barSize),
          left: unref(barStart)
        }
  })
  const sliderDisabled = computed(() => {
    return unref(disabled) || (elForm.props || {}).disabled
  })

  function getStopStyle(position) {
    return unref(vertical)
      ? { bottom: position + '%' }
      : { left: position + '%' }
  }
  return {
    stops,
    markList,
    barSize,
    barStart,
    precision,
    runwayStyle,
    barStyle,
    sliderDisabled,
    getStopStyle
  }
}
</script>
