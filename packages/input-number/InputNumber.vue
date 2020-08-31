<template>
  <div
    @dragstart.prevent
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]"
  >
    <span
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{ 'is-disabled': minDisabled }"
      @keydown.enter="decrease"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{ 'is-disabled': maxDisabled }"
      @keydown.enter="increase"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    ></el-input>
  </div>
</template>
<script>
import ElInput from 'element-ui/packages/input'
import Focus from 'element-ui/src/mixins/focus'
import RepeatClick from 'element-ui/src/directives/repeatClick'
import {
  ref,
  toRefs,
  onMounted,
  onUpdated,
  getCurrentInstance,
  watch
} from 'vue'
import { useInputNumber } from './use'

export default {
  name: 'ElInputNumber',
  mixins: [Focus('input')],
  directives: {
    repeatClick: RepeatClick
  },
  components: { ElInput },
  emits: ['input', 'change', 'blur', 'clear', 'focus', 'update:modelValue'],
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
    value: {},
    disabled: Boolean,
    size: {
      type: String,
      default: ''
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
      }
    }
  },
  setup(props, { emit }) {
    const {
      min,
      max,
      size,
      disabled,
      controls,
      controlsPosition,
      value,
      step,
      precision,
      stepStrictly
    } = toRefs(props)
    let currentValue = ref(0)
    let userInput = ref(null)

    const {
      useSize,
      inputNumberDisabled,
      controlsAtRight,
      numPrecision,
      minDisabled,
      maxDisabled,
      _increase,
      _decrease,
      toPrecision
    } = useInputNumber({
      min,
      max,
      size,
      step,
      value,
      disabled,
      controls,
      precision,
      currentValue,
      controlsPosition
    })

    const inputNumberSize = useSize()

    const getPrecision = (value) => {
      if (value === undefined) return 0
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      return dotPosition !== -1 ? valueString.length - dotPosition - 1 : 0
    }

    const displayValue = () => {
      if (userInput !== null) {
        return userInput
      }
      if (typeof currentValue === 'number') {
        if (stepStrictly) {
          const stepPrecision = getPrecision(step)
          const precisionFactor = Math.pow(10, stepPrecision)
          currentValue =
            (Math.round(currentValue / step) * precisionFactor * step) /
            precisionFactor
        }

        if (precision !== undefined) {
          currentValue = currentValue.toFixed(precision)
        }
      }
      return currentValue
    }

    const setCurrentValue = (newVal) => {
      const oldVal = currentValue
      if (typeof newVal === 'number' && precision !== undefined) {
        newVal = toPrecision(newVal, precision)
      }
      if (newVal >= max) newVal = max
      if (newVal <= min) newVal = min
      if (oldVal === newVal) return
      userInput = null
      emit('input', newVal)
      emit('change', newVal, oldVal)
      currentValue = newVal
    }

    const increase = () => {
      if (inputNumberDisabled || maxDisabled) return
      const newVal = _increase(value || 0, step)
      setCurrentValue(newVal)
    }
    const decrease = () => {
      if (inputNumberDisabled || minDisabled) return
      const newVal = _decrease(value || 0, step)
      setCurrentValue(newVal)
    }

    const handleInput = (value) => {
      userInput = value
    }

    const handleBlur = (event) => {
      emit('blur', event)
    }
    const handleFocus = (event) => {
      emit('focus', event)
    }

    const handleInputChange = (value) => {
      const newVal = value === '' ? undefined : Number(value)
      if (!isNaN(newVal) || value === '') {
        setCurrentValue(newVal)
      }
      userInput = null
    }
    const select = () => {
      getCurrentInstance()
      this.$refs.input.select()
    }

    onMounted(() => {
      console.log(getCurrentInstance().ctx.$refs.input.$refs.input)
      const innerInput = getCurrentInstance().ctx.$refs.input.$refs.input
      innerInput.setAttribute('role', 'spinbutton')
      innerInput.setAttribute('aria-valuemax', max)
      innerInput.setAttribute('aria-valuemin', min)
      innerInput.setAttribute('aria-valuenow', currentValue)
      innerInput.setAttribute('aria-disabled', inputNumberDisabled)
    })

    onUpdated(() => {
      const refs = getCurrentInstance().ctx.$refs
      if (!refs || !refs.input) return
      const innerInput = refs.input.$refs.input
      innerInput.setAttribute('aria-valuenow', this.currentValue)
    })

    watch('value', (value) => {
      let newVal = value === undefined ? value : Number(value)
      if (newVal !== undefined) {
        if (isNaN(newVal)) return
        if (stepStrictly) {
          const stepPrecision = getPrecision(step)
          const precisionFactor = Math.pow(10, stepPrecision)
          newVal =
            (Math.round(newVal / step) * precisionFactor * step) /
            precisionFactor
        }
        if (precision !== undefined) {
          newVal = toPrecision(newVal, precision)
        }
      }
      if (newVal >= max) newVal = max
      if (newVal <= min) newVal = min
      currentValue = newVal
      userInput = null
      emit('input', newVal)
    })

    return {
      currentValue,
      userInput,
      handleInput,
      handleBlur,
      handleFocus,
      inputNumberSize,
      inputNumberDisabled,
      controlsAtRight,
      getPrecision,
      numPrecision,
      displayValue,
      toPrecision,
      minDisabled,
      maxDisabled,
      setCurrentValue,
      _increase,
      _decrease,
      increase,
      decrease,
      handleInputChange,
      select
    }
  }
}
</script>
