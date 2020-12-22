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
      <i class="el-rate__icon" :class="[{ hover: false }, classes[item - 1]]">
        <i class="el-rate__decimal" v-if="allowHalf"></i>
      </i>
    </span>
    <span v-if="showText || showScore" class="el-rate__text"
      >{{ rateText }}
    </span>
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

    const rateDisabled = () => {
      return computed(() => disabled.value)
    }
    const rateText = computed(() => {
      // 可能是文字评价可能是分数
      return texts.value[modelValue.value - 1]
    })
    const iconColor = computed(() => {
      return matchClassOrColor(colors)
    })

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
    //完善各函数后，加上有关disabled判断
    const matchClassOrColor = (classOrColor) => {
      const unrefObj = unref(unifiedIconClassOrColor(unref(classOrColor)))
      let arr = Object.keys(unrefObj).filter((key) => {
        const each = unrefObj[key]
        const excluded = each instanceof Object ? each.excluded : false
        return excluded ? modelValue.value < key : modelValue.value <= key
      })
      // console.log('arr', arr)
      const matchKey = Math.min(...arr)
      return unrefObj[matchKey] instanceof Object
        ? unrefObj[matchKey].value
        : unrefObj[matchKey]
    }
    const activeClass = computed(() => {
      return matchClassOrColor(iconClasses)
    })
    const voidClass = computed(() => {
      return rateDisabled().value
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
      // console.log(result, 'classesResult')
      return result
    })
    // eslint-disable-next-line no-unused-vars
    const slideSelectRate = (value, event) => {}
    const clickUpdateRate = (value) => {
      setRate(value)
    }
    const pressKeyUpdateRate = (e) => {
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
      // methods
      clickUpdateRate,
      slideSelectRate,
      pressKeyUpdateRate
    }
  }
}
</script>
