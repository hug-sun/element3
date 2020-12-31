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
        :class="[{ hover: hoverIndex === item }, classes[item - 1]]"
        :style="{ color: iconColor(item) }"
      >
        <i
          class="el-rate__decimal"
          v-if="showDecimalIcon"
          :style="{ width: decimalStyle, color: decimalIconColor(item) }"
          :class="decimalIconClass"
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

<script lang="ts">
import {
  inject,
  toRefs,
  computed,
  unref,
  ref,
  defineComponent
  // watch,
  // getCurrentInstance
} from 'vue'
import { props } from './props'
// import { hasClass } from '../../src/utils/dom'

export default defineComponent({
  name: 'ElRate',

  props,

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

    const elForm = inject('elForm', { disabled: false })

    const rateDisabled = computed(() => disabled.value || elForm.disabled)

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
    const decimalIconClass = () => {
      console.log('半星class')
      return activeClass.value
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
      let arr: Array<string> = Object.keys(unrefObj).filter((key) => {
        const each = unrefObj[key]
        const excluded = each instanceof Object ? each.excluded : false
        return excluded
          ? Math.ceil(modelValue.value) < Number(key)
          : Math.ceil(modelValue.value) <= Number(key)
      })
      const matchKey = Math.min(...arr.map((item) => Number(item)))
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
    const hoverIndex = ref(-1)
    const slideSelectRate = (value) => {
      if (rateDisabled.value) return
      hoverIndex.value = value
    }
    const clickUpdateRate = (value) => {
      if (rateDisabled.value) return
      setRate(value)
    }
    const pressKeyUpdateRate = (e) => {
      if (rateDisabled.value) return
      let value = modelValue.value
      if (e.keyCode === 38 || e.keyCode === 39) {
        value += 1
        value = value > max.value ? max.value : value
      }
      if (e.keyCode === 37 || e.keyCode === 40) {
        value -= 1
        value = value < 0 ? 0 : value
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
      decimalIconClass,
      showDecimalIcon,
      activeClass,
      hoverIndex,
      // methods
      clickUpdateRate,
      slideSelectRate,
      pressKeyUpdateRate
    }
  }
})
</script>
