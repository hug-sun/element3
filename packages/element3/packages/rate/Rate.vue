<template>
  <div
    class="el-rate"
    @keydown="handleKey"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuetext="text"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0"
  >
    <span
      v-for="(item, key) in max"
      class="el-rate__item"
      @mousemove="setCurrentValue(item, $event)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      :key="key"
    >
      <i
        class="el-rate__icon"
        :class="[classes[item - 1], { hover: hoverIndex === item }]"
        :style="getIconStyle(item)"
      >
        <i
          class="el-rate__decimal"
          v-if="showDecimalIcon(item)"
          :class="decimalIconClass"
          :style="decimalStyle"
        ></i>
      </i>
    </span>
    <span
      v-if="showText || showScore"
      class="el-rate__text"
      :style="{ color: textColor }"
      >{{ text }}</span
    >
  </div>
</template>

<script>
import {
  inject,
  toRefs,
  computed,
  unref,
  ref,
  watch,
  getCurrentInstance
} from 'vue'
import { hasClass } from '../../src/utils/dom'
import { migrating } from '../../src/composables/migrating'

export default {
  name: 'ElRate',

  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    lowThreshold: {
      type: Number,
      default: 2
    },
    highThreshold: {
      type: Number,
      default: 4
    },
    max: {
      type: Number,
      default: 5
    },
    colors: {
      type: [Array, Object],
      default() {
        return ['#F7BA2A', '#F7BA2A', '#F7BA2A']
      }
    },
    voidColor: {
      type: String,
      default: '#C6D1DE'
    },
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7'
    },
    iconClasses: {
      type: [Array, Object],
      default() {
        return ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on']
      }
    },
    voidIconClass: {
      type: String,
      default: 'el-icon-star-off'
    },
    disabledVoidIconClass: {
      type: String,
      default: 'el-icon-star-on'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: '#1f2d3d'
    },
    texts: {
      type: Array,
      default() {
        return ['极差', '失望', '一般', '满意', '惊喜']
      }
    },
    scoreTemplate: {
      type: String,
      default: '{value}'
    }
  },

  emits: ['update:modelValue', 'change'],

  setup(props, { emit }) {
    const {
      modelValue,
      disabled,
      allowHalf,
      disabledVoidIconClass,
      voidIconClass,
      iconClasses,
      max,
      lowThreshold,
      highThreshold,
      texts,
      colors,
      voidColor,
      disabledVoidColor,
      showScore,
      scoreTemplate,
      showText
    } = toRefs(props)

    migrating({
      'text-template': 'text-template is renamed to score-template.'
    })

    modelValue || emit('update:modelValue', 0)

    const elForm = inject('elForm', {})

    const rateDisabled = useDisabled(disabled, elForm)

    const {
      currentValue,
      hoverIndex,
      pointerAtLeftHalf,
      setCurrentValue,
      resetCurrentValue,
      selectValue,
      handleKey
    } = useCurrentValue({
      modelValue,
      allowHalf,
      rateDisabled,
      max
    })

    const { classMap, colorMap } = useMaps({
      colors,
      iconClasses,
      lowThreshold,
      highThreshold,
      max
    })

    const { classes, decimalIconClass } = useClasses({
      currentValue,
      modelValue,
      classMap,
      allowHalf,
      max,
      rateDisabled,
      disabledVoidIconClass,
      voidIconClass
    })

    const { activeColor, getIconStyle } = useColor({
      currentValue,
      colorMap,
      rateDisabled,
      disabledVoidColor,
      voidColorProp: voidColor
    })

    const { decimalStyle, showDecimalIcon } = useDecimal({
      currentValue,
      modelValue,
      allowHalf,
      rateDisabled,
      pointerAtLeftHalf,
      activeColor
    })

    const text = computed(() => {
      let result = ''
      if (showScore.value) {
        result = scoreTemplate.value.replace(
          /\{\s*value\s*\}/,
          unref(rateDisabled) ? modelValue.value : currentValue.value
        )
      } else if (showText.value) {
        result = texts.value[Math.ceil(currentValue.value) - 1]
      }
      return result
    })

    return {
      // state
      rateDisabled,
      classMap,
      classes,
      text,
      hoverIndex,
      decimalStyle,
      decimalIconClass,
      // methods
      getIconStyle,
      setCurrentValue,
      resetCurrentValue,
      selectValue,
      handleKey,
      showDecimalIcon
    }
  }
}

const getValueFromMap = (value, map) => {
  map = unref(map)
  const matchedKeys = Object.keys(map)
    .filter((key) => {
      const val = map[key]
      const excluded = val instanceof Object ? val.excluded : false
      return excluded ? value < key : value <= key
    })
    .sort((a, b) => a - b)
  const matchedValue = map[matchedKeys[0]]
  return matchedValue instanceof Object
    ? matchedValue.value
    : matchedValue || ''
}

const useDisabled = (disabled, elForm) => {
  return computed(() => disabled.value || elForm.disabled)
}

const useMaps = ({ colors, iconClasses, lowThreshold, highThreshold, max }) => {
  const useMap = (mapData, { lowThreshold, highThreshold, max }) => {
    return computed(() =>
      Array.isArray(mapData)
        ? {
            [lowThreshold.value]: mapData[0],
            [highThreshold.value]: { value: mapData[1], excluded: true },
            [max.value]: mapData[2]
          }
        : mapData
    )
  }
  return {
    classMap: useMap(unref(iconClasses), { lowThreshold, highThreshold, max }),
    colorMap: useMap(unref(colors), { lowThreshold, highThreshold, max })
  }
}

const useClasses = ({
  currentValue,
  modelValue,
  classMap,
  allowHalf,
  max,
  rateDisabled,
  disabledVoidIconClass,
  voidIconClass
}) => {
  const activeClass = computed(() =>
    getValueFromMap(currentValue.value, unref(classMap))
  )
  const voidClass = computed(() =>
    unref(rateDisabled) ? disabledVoidIconClass.value : voidIconClass.value
  )
  const decimalIconClass = computed(() =>
    getValueFromMap(modelValue.value, unref(classMap))
  )

  const classes = computed(() => {
    const result = []
    let i = 0
    let threshold = currentValue.value
    if (
      allowHalf.value &&
      currentValue.value !== Math.floor(currentValue.value)
    ) {
      threshold--
    }
    for (; i < threshold; i++) {
      result.push(activeClass.value)
    }
    for (; i < max.value; i++) {
      result.push(voidClass.value)
    }
    return result
  })

  return {
    classes,
    decimalIconClass
  }
}

const useColor = ({
  currentValue,
  colorMap,
  rateDisabled,
  disabledVoidColor,
  voidColorProp
}) => {
  const activeColor = computed(() =>
    getValueFromMap(currentValue.value, colorMap)
  )
  const getIconStyle = (item) => {
    const voidColor = rateDisabled.value
      ? disabledVoidColor.value
      : voidColorProp.value
    return {
      color: unref(item <= currentValue.value ? activeColor.value : voidColor)
    }
  }
  return {
    activeColor,
    getIconStyle
  }
}

const useDecimal = ({
  currentValue,
  modelValue,
  allowHalf,
  rateDisabled,
  pointerAtLeftHalf,
  activeColor
}) => {
  const valueDecimal = computed(
    () => modelValue.value * 100 - Math.floor(modelValue.value) * 100
  )
  const decimalStyle = computed(() => {
    let width = ''
    if (unref(rateDisabled)) {
      width = `${valueDecimal.value}%`
    } else if (allowHalf.value) {
      width = '50%'
    }
    return {
      color: activeColor.value,
      width
    }
  })

  const showDecimalIcon = (item) => {
    const showWhenDisabled =
      unref(rateDisabled) &&
      valueDecimal.value > 0 &&
      item - 1 < modelValue.value &&
      item > modelValue.value
    /* istanbul ignore next */
    const showWhenAllowHalf =
      allowHalf.value &&
      pointerAtLeftHalf &&
      item - 0.5 <= currentValue.value &&
      item > currentValue.value
    return showWhenDisabled || showWhenAllowHalf
  }

  return {
    decimalStyle,
    showDecimalIcon
  }
}

const useCurrentValue = ({ modelValue, allowHalf, rateDisabled, max }) => {
  const { emit } = getCurrentInstance()
  const currentValue = ref(modelValue.value)
  const pointerAtLeftHalf = ref(false)
  const hoverIndex = ref(-1)
  watch(modelValue, (v) => {
    currentValue.value = v
  })

  const setCurrentValue = (value, event) => {
    if (rateDisabled.value) {
      return
    }
    /* istanbul ignore if */
    if (allowHalf.value) {
      let target = event.target
      if (hasClass(target, 'el-rate__item')) {
        target = target.querySelector('.el-rate__icon')
      }
      if (hasClass(target, 'el-rate__decimal')) {
        target = target.parentNode
      }
      pointerAtLeftHalf.value = event.offsetX * 2 <= target.clientWidth
      currentValue.value = pointerAtLeftHalf.value ? value - 0.5 : value
    } else {
      currentValue.value = value
    }
    hoverIndex.value = value
  }

  const resetCurrentValue = () => {
    if (rateDisabled.value) {
      return
    }
    if (allowHalf.value) {
      pointerAtLeftHalf.value =
        modelValue.value !== Math.floor(modelValue.value)
    }
    currentValue.value = modelValue.value
    hoverIndex.value = -1
  }

  const selectValue = (value) => {
    if (rateDisabled.value) {
      return
    }
    if (allowHalf.value && pointerAtLeftHalf.value) {
      emit('update:modelValue', currentValue.value)
      emit('change', currentValue.value)
    } else {
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  const handleKey = (e) => {
    if (rateDisabled.value) {
      return
    }
    let value = currentValue.value
    const keyCode = e.keyCode
    if (keyCode === 38 || keyCode === 39) {
      // left / down
      if (allowHalf.value) {
        value += 0.5
      } else {
        value += 1
      }
      e.stopPropagation()
      e.preventDefault()
    } else if (keyCode === 37 || keyCode === 40) {
      if (allowHalf.value) {
        value -= 0.5
      } else {
        value -= 1
      }
      e.stopPropagation()
      e.preventDefault()
    }
    value = value < 0 ? 0 : value
    value = value > max.value ? max.value : value

    emit('update:modelValue', value)
    emit('change', value)
  }

  return {
    currentValue,
    hoverIndex,
    pointerAtLeftHalf,
    setCurrentValue,
    resetCurrentValue,
    selectValue,
    handleKey
  }
}
</script>
