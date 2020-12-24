<template>
  <div
    class="el-rate"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuetext="1"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0"
    @keydown.stop.prevent="pressKeyUpdateRate($event)"
  >
    <span
      v-for="(item, key) in max"
      class="el-rate__item"
      :key="key"
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      @mousemove="slideSelectRate(item)"
      @click="clickUpdateRate(item)"
    >
      <i
        class="el-rate__icon"
        :class="[{ hover: false }, classes[item - 1]]"
        :style="{ color: iconColor(item) }"
      >
        <i
          class="el-rate__decimal"
          v-if="showDecimalIcon"
          :style="{ width: decimalStyle, color: decimalIconColor(item) }"
        ></i>
      </i>
    </span>
    <span
      v-if="showText || showScore"
      class="el-rate__text"
      :style="{ color: textColor }"
      >{{ rateText }}
    </span>
  </div>
</template>

<script>
import {
  // inject,
  toRefs,
  computed,
  unref
  // ref,
  // watch,
  // getCurrentInstance
} from 'vue'
// import { hasClass } from '../../src/utils/dom'

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
      showText
    } = toRefs(props)

    const rateDisabled = computed(() => disabled.value)

    const percentage = computed(() => {
      return (modelValue.value - Math.floor(modelValue.value)) * 100
    })
    const decimalStyle = computed(() => {
      let width = ''
      console.log(152, rateDisabled.value)
      if (rateDisabled.value) {
        width = `${percentage.value}%`
        console.log(155, width)
      } else if (allowHalf.value) {
        width = '50%'
      }
      return width
    })
    console.log(160, decimalStyle.value)

    const showDecimalIcon = computed(
      () => allowHalf.value || percentage.value !== 0
    )
    const rateText = computed(() => {
      if (showScore.value) {
        return modelValue.value
      } else if (showText.value) {
        return texts.value[modelValue.value - 1]
      }
    })
    const iconColor = (item) => {
      return item <= modelValue.value
        ? matchClassOrColor(colors)
        : rateDisabled.value
        ? disabledVoidColor.value
        : voidColor.value
    }
    const decimalIconColor = (item) => {
      return item <= Math.ceil(modelValue.value)
        ? matchClassOrColor(colors)
        : disabledVoidColor.value
    }

    //unrefIconClasses形参需要改个名
    const unifiedIconClassOrColor = (unrefIconClasses) => {
      return computed(() => {
        return Array.isArray(unrefIconClasses)
          ? {
              [lowThreshold.value]: unrefIconClasses[0],
              [highThreshold.value]: {
                value: unrefIconClasses[1],
                excluded: true
              },
              [max.value]: unrefIconClasses[2]
            }
          : unrefIconClasses
      })
    }
    const matchClassOrColor = (classOrColor) => {
      const unrefObj = unref(unifiedIconClassOrColor(unref(classOrColor)))
      let arr = Object.keys(unrefObj).filter((key) => {
        const each = unrefObj[key]
        const excluded = each instanceof Object ? each.excluded : false
        return excluded ? modelValue.value < key : modelValue.value <= key
      })
      const matchKey = Math.min(...arr)
      return unrefObj[matchKey] instanceof Object
        ? unrefObj[matchKey].value
        : unrefObj[matchKey]
    }
    const activeClass = computed(() => {
      return matchClassOrColor(iconClasses)
    })
    const voidClass = computed(() => {
      return rateDisabled.value
        ? disabledVoidIconClass.value
        : voidIconClass.value
    })
    const classes = computed(() => {
      const result = []
      let i = 0
      let criticalPoint = modelValue.value
      for (; i < criticalPoint; i++) {
        result.push(activeClass.value)
      }
      for (; i < max.value; i++) {
        result.push(voidClass.value)
      }
      return result
    })
    // eslint-disable-next-line no-unused-vars
    const slideSelectRate = (value, event) => {}
    const clickUpdateRate = (value) => {
      if (rateDisabled.value) return
      setRate(value)
    }
    const pressKeyUpdateRate = (e) => {
      if (rateDisabled.value) return
      let value = modelValue.value
      //增加和减少需要判断临界值
      if (e.keyCode === 38 || e.keyCode === 39) {
        value += 1
      }
      if (e.keyCode === 37 || e.keyCode === 40) {
        value -= 1
      }

      setRate(value)
    }
    const setRate = (value) => {
      emit('update:modelValue', value)
      emit('change', value)
    }

    return {
      // state
      rateDisabled,
      classes,
      rateText,
      iconColor,
      decimalIconColor,
      decimalStyle,
      showDecimalIcon,
      activeClass,
      // methods
      clickUpdateRate,
      slideSelectRate,
      pressKeyUpdateRate
    }
  }
}
</script>
