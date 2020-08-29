import { computed, inject, unref, getCurrentInstance } from 'vue'

export const useInputNumber = ({
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
}) => {
  const useSize = () => {
    const elFormItem = inject('elFormItem', {})
    const _elFormItemSize = computed(() => {
      return unref(elFormItem.elFormItemSize)
    })
    const inputNumberSize = computed(() => {
      return (
        size.value ||
        _elFormItemSize ||
        (getCurrentInstance().ctx.$ELEMENT || {}).size
      )
    })
    return inputNumberSize
  }

  const inputNumberDisabled = () => {
    const elForm = inject('elForm', {})
    return unref(disabled) || !!unref(elForm.disabled)
  }

  const controlsAtRight = () => {
    return controls && controlsPosition === 'right'
  }

  const getPrecision = (value) => {
    if (value === undefined) return 0
    const valueString = value.toString()
    const dotPosition = valueString.indexOf('.')
    return dotPosition !== -1 ? valueString.length - dotPosition - 1 : 0
  }

  const numPrecision = () => {
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
  }

  const toPrecision = (num, precision) => {
    if (precision === undefined) precision = numPrecision
    return parseFloat(
      Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
    )
  }

  const _increase = (val, step) => {
    if (typeof val !== 'number' && val !== undefined) {
      return currentValue
    }

    const precisionFactor = Math.pow(10, numPrecision)
    // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
    return toPrecision(
      (precisionFactor * val + precisionFactor * step) / precisionFactor
    )
  }

  const _decrease = (val, step) => {
    if (typeof val !== 'number' && val !== undefined) {
      return currentValue
    }

    const precisionFactor = Math.pow(10, numPrecision)

    return toPrecision(
      (precisionFactor * val - precisionFactor * step) / precisionFactor
    )
  }

  const minDisabled = () => {
    return _decrease(value, step) < min
  }

  const maxDisabled = () => {
    return _increase(value, step) > max
  }

  return {
    useSize,
    inputNumberDisabled,
    controlsAtRight,
    numPrecision,
    minDisabled,
    maxDisabled,
    _increase,
    _decrease,
    toPrecision
  }
}
