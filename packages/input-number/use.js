import { computed, inject, unref, getCurrentInstance, watch } from 'vue'

export const useInputNumber = ({
  min,
  max,
  size,
  step,
  value,
  userInput,
  disabled,
  controls,
  precision,
  currentValue,
  controlsPosition
}) => {
  const _elFormItemSize = computed(() => {
    const elFormItem = inject('elFormItem', {})
    return unref(elFormItem.elFormItemSize)
  })

  const inputNumberSize = computed(() => {
    return (
      size || _elFormItemSize || (getCurrentInstance().ctx.$ELEMENT || {}).size
    )
  })
  const inputNumberDisabled = computed(() => {
    const elForm = inject('elForm', {})
    return unref(disabled) || !!unref(elForm.disabled)
  })

  const controlsAtRight = computed(() => {
    return controls && controlsPosition === 'right'
  })

  const getPrecision = (value) => {
    if (value === undefined) return 0
    const valueString = value.toString()
    const dotPosition = valueString.indexOf('.')
    return dotPosition !== -1 ? valueString.length - dotPosition - 1 : 0
  }

  const numPrecision = computed(() => {
    const stepPrecision = getPrecision(step)
    if (precision !== undefined) {
      if (stepPrecision > precision) {
        console.warn(
          '[Element Warn][InputNumber]precision should not be less than the decimal places of step'
        )
      }
      return precision
    } else {
      return Math.max(getPrecision(value), stepPrecision)
    }
  })

  const toPrecision = (num, precision) => {
    if (precision === undefined) precision = numPrecision.value
    return parseFloat(
      Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
    )
  }

  const _increase = (val, step) => {
    if (typeof val !== 'number' && val !== undefined) return currentValue

    const precisionFactor = Math.pow(10, numPrecision.value)
    // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
    return toPrecision(
      (precisionFactor * val + precisionFactor * step) / precisionFactor
    )
  }

  const _decrease = (val, step) => {
    if (typeof val !== 'number' && val !== undefined) return currentValue

    const precisionFactor = Math.pow(10, numPrecision.value)

    return toPrecision(
      (precisionFactor * val - precisionFactor * step) / precisionFactor
    )
  }

  const displayValue = computed(() => {
    if (userInput !== null) return userInput
    if (typeof currentValue.value === 'number') {
      if (this.stepStrictly) {
        const stepPrecision = this.getPrecision(this.step)
        const precisionFactor = Math.pow(10, stepPrecision)
        currentValue.value =
          (Math.round(currentValue.value / this.step) *
            precisionFactor *
            this.step) /
          precisionFactor
      }
      if (this.precision !== undefined) {
        currentValue.value = currentValue.value.toFixed(this.precision)
      }
    }
    return currentValue
  })

  const minDisabled = computed(() => _decrease(value, step) < min)

  const maxDisabled = computed(() => _increase(value, step) > max)

  return {
    inputNumberSize,
    inputNumberDisabled,
    controlsAtRight,
    numPrecision,
    minDisabled,
    maxDisabled,
    toPrecision,
    displayValue,
    _increase,
    _decrease
  }
}

export const useInputNumberInteractive = ({
  max,
  min,
  emit,
  step,
  value,
  userInput,
  precision,
  _increase,
  _decrease,
  toPrecision,
  maxDisabled,
  minDisabled,
  stepStrictly,
  currentValue,
  getPrecision,
  inputNumberDisabled
}) => {
  // const getInput = () => {
  //   return unref(userInput)
  // }
  const handleBlur = (event) => {
    emit('blur', event)
  }
  const handleFocus = (event) => {
    emit('focus', event)
  }
  const handleInput = (value) => {
    userInput.value = value
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
  const handleInputChange = (value) => {
    const newVal = value === '' ? undefined : Number(value)
    if (!isNaN(newVal) || value === '') {
      setCurrentValue(newVal)
    }
    userInput = null
  }

  const increase = () => {
    if (inputNumberDisabled.value || maxDisabled.value) return
    const newVal = _increase(value || 0, step)
    setCurrentValue(newVal)
  }
  const decrease = () => {
    if (inputNumberDisabled.value || minDisabled.value) return
    const newVal = _decrease(value || 0, step)
    setCurrentValue(newVal)
  }

  const select = () => {
    this.$refs.input.select()
  }

  watch(value, (value) => {
    let newVal = value === undefined ? value : Number(value)
    if (newVal !== undefined) {
      if (isNaN(newVal)) return
      if (stepStrictly) {
        const stepPrecision = getPrecision(step)
        const precisionFactor = Math.pow(10, stepPrecision)
        newVal =
          (Math.round(newVal / step) * precisionFactor * step) / precisionFactor
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
    select,
    increase,
    decrease,
    handleBlur,
    handleFocus,
    handleInput,
    setCurrentValue,
    handleInputChange
  }
}
