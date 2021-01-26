<template>
  <div
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]"
    @dragstart.prevent
  >
    <span
      :class="{ 'is-disabled': minDisabled }"
      @keydown.enter="decrease"
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      :class="{ 'is-disabled': maxDisabled }"
      @keydown.enter="increase"
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      :disabled="inputNumberDisabled"
      :label="label"
      :max="max"
      :min="min"
      :name="name"
      :placeholder="placeholder"
      :size="inputNumberSize"
      @blur="handleBlur"
      @change="handleInputChange"
      @focus="handleFocus"
      @input="handleInput"
      @keydown.down.prevent="decrease"
      @keydown.up.prevent="increase"
      ref="input"
      v-model="displayValue"
    ></el-input>
  </div>
</template>
<script>
import { ElInput } from '../../src/components/Input'
import useFocus from '../../src/composables/focus.js'
import RepeatClick from '../../src/directives/repeatClick'
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onUpdated,
  reactive,
  toRefs,
  watch
} from 'vue'

export default {
  name: 'ElInputNumber',
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    ElInput
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    modelValue: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    size: {
      default: '',
      type: String
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10)
      },
      default: undefined
    }
  },
  emits: ['change', 'update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const {
      step,
      stepStrictly,
      max,
      min,
      modelValue,
      disabled,
      size,
      controls,
      controlsPosition,
      precision
    } = toRefs(props)

    const state = reactive({
      currentValue: 0,
      userInput: null
    })
    const focus = useFocus('input')

    const getPrecision = (value) => {
      if (value === undefined) return 0
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      let precision = 0
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
      }
      return precision
    }

    const setCurrentValue = (newVal) => {
      const oldVal = state.currentValue
      if (typeof newVal === 'number' && precision.value !== undefined) {
        newVal = toPrecision(newVal, precision.value)
      }
      if (newVal >= max.value) newVal = max.value
      if (newVal <= min.value) newVal = min.value
      if (oldVal === newVal) return
      state.userInput = null
      emit('update:modelValue', newVal)
      emit('change', newVal, oldVal)
      state.currentValue = newVal
    }

    const toPrecision = (num, precision) => {
      if (precision === undefined) precision = numPrecision.value
      return parseFloat(
        Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
      )
    }

    const _decrease = (val, step) => {
      if (typeof val !== 'number' && val !== undefined) {
        return state.currentValue
      }

      const precisionFactor = Math.pow(10, numPrecision.value)

      return toPrecision(
        (precisionFactor * val - precisionFactor * step) / precisionFactor
      )
    }

    const _increase = (val, step) => {
      if (typeof val !== 'number' && val !== undefined) {
        return state.currentValue
      }

      const precisionFactor = Math.pow(10, numPrecision.value)
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return toPrecision(
        (precisionFactor * val + precisionFactor * step) / precisionFactor
      )
    }

    const minDisabled = computed(() => {
      return _decrease(modelValue.value, step.value) < min.value
    })

    const maxDisabled = computed(() => {
      return _increase(modelValue.value, step.value) > max.value
    })

    const numPrecision = computed(() => {
      const stepPrecision = getPrecision(step.value)
      if (precision.value !== undefined) {
        if (stepPrecision > precision.value) {
          console.warn(
            '[Element Warn][InputNumber]precision should not be less than the decimal places of step'
          )
        }
        return precision.value
      } else {
        return Math.max(getPrecision(modelValue.value), stepPrecision)
      }
    })

    const controlsAtRight = computed(
      () => controls.value && controlsPosition.value === 'right'
    )

    const _elFormItemSize = computed(() => {
      const elFormItem = inject('elFormItem', {})
      return (elFormItem || {}).elFormItemSize
    })

    const inputNumberSize = computed(() => {
      return size.value || _elFormItemSize.value || (proxy.$ELEMENT || {}).size
    })

    const inputNumberDisabled = computed(() => {
      const elForm = inject('elForm', {})
      return disabled.value || !!(elForm || {}).disabled
    })

    const displayValue = computed({
      get: () => {
        if (state.userInput !== null) {
          return state.userInput
        }
        let currentValue = state.currentValue
        if (typeof currentValue === 'number') {
          if (stepStrictly.value) {
            const stepPrecision = getPrecision(step.value)
            const precisionFactor = Math.pow(10, stepPrecision)
            currentValue =
              (Math.round(currentValue / step.value) *
                precisionFactor *
                step.value) /
              precisionFactor
          }
          if (precision.value !== undefined) {
            currentValue = currentValue.toFixed(precision.value)
          }
        }
        return currentValue
      },
      set: () => {
        return state.currentValue
      }
    })
    const increase = () => {
      if (inputNumberDisabled.value || maxDisabled.value) return

      const value = modelValue.value || 0
      const newVal = _increase(value, step.value)
      setCurrentValue(newVal)
    }

    const decrease = () => {
      if (inputNumberDisabled.value || minDisabled.value) return
      const value = modelValue.value || 0
      const newVal = _decrease(value, step.value)
      setCurrentValue(newVal)
    }

    const handleInput = (value) => {
      state.userInput = value
    }

    const handleInputChange = (value) => {
      const newVal = value === '' ? undefined : Number(value)
      if (!isNaN(newVal) || value === '') {
        setCurrentValue(newVal)
      }
      state.userInput = null
    }

    onMounted(() => {
      const { refs } = getCurrentInstance()
      const innerInput = refs.input.$el && refs.input.$refs.input

      innerInput.setAttribute('role', 'spinbutton')
      innerInput.setAttribute('aria-valuemax', max.value)
      innerInput.setAttribute('aria-valuemin', min.value)
      innerInput.setAttribute('aria-valuenow', state.currentValue)
      innerInput.setAttribute('aria-disabled', inputNumberDisabled.value)
    })

    onUpdated(() => {
      const { refs } = getCurrentInstance()
      if (!refs || !refs.input.$el) return
      const innerInput = refs.input.$el && refs.input.$refs.input
      innerInput.setAttribute('aria-valuenow', state.currentValue)
    })

    watch(
      modelValue,
      (value) => {
        let newVal = value === undefined ? value : Number(value)
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return
          }
          if (stepStrictly.value) {
            const stepPrecision = getPrecision(step.value)
            const precisionFactor = Math.pow(10, stepPrecision)
            newVal =
              (Math.round(newVal / step.value) * precisionFactor * step.value) /
              precisionFactor
          }

          if (precision.value !== undefined) {
            newVal = toPrecision(newVal, precision.value)
          }
        }
        if (newVal >= max.value) newVal = max.value
        if (newVal <= min.value) newVal = min.value
        state.currentValue = newVal
        state.userInput = null
        emit('update:modelValue', newVal)
      },
      {
        immediate: true
      }
    )

    const handleBlur = (event) => {
      emit('blur', event)
    }
    const handleFocus = (event) => {
      emit('focus', event)
    }
    const select = () => {}
    return {
      controlsAtRight,
      inputNumberSize,
      displayValue,
      minDisabled,
      maxDisabled,
      inputNumberDisabled,
      increase,
      decrease,
      handleInputChange,
      handleInput,
      focus,
      setCurrentValue,
      handleBlur,
      handleFocus,
      select
    }
  }
}
</script>
