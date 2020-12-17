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
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer'}"
      @mousemove="slideSelectRate(item)"
      @click="clickUpdateRate(item)"
    >
      <i
        class="el-rate__icon"
        :class="[{hover: true}, classes[item-1]]"
      >
        <i
          class="el-rate__decimal"
          v-if="allowHalf"
        ></i>
      </i>
    </span>
    <span
      v-if="showText || showScore"
      class="el-rate__text"
      >
      </span
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
      return disabled
    }
    const unifiediconClasses = () => {//后续要加入color，需要改名和进一步封装
    const unrefIconClasses = unref(iconClasses)
      return Array.isArray(unrefIconClasses) ? {
          [lowThreshold.value]: unrefIconClasses[0],
          [highThreshold.value]: {value: unrefIconClasses[1], excluded: true},
          [max.value]: unrefIconClasses[2]
        } : unrefIconClasses.value
    }
    //完善各函数后，加上有关disabled判断
    const matchClassOrColor = (() => {
      //需要把数组统一转成对象 --> unifiediconClasses
      //拿到对象，判断分数在某段中的包含关系，可以确定临界值属于哪个分段exclude：false是包含，exclude：true是不包含   
      //当前选中的值在哪个分段中，就把相应的class return出去
      
      const matchKey = Math.max(Object.keys(unifiediconClasses()).filter(+key=>{
        const excluded = unifiediconClasses()[key] instanceof Object ? unifiediconClasses()[key].encluded : false
        return excluded ? modelValue.value < key : modelValue.value <= key
      }))
      console.log(175,Object.keys(unifiediconClasses()).filter(+key=>{
        const excluded = unifiediconClasses()[key] instanceof Object ? unifiediconClasses()[key].encluded : false
        return excluded ? modelValue.value < key : modelValue.value <= key
      }))

      //matchKey对应的value可能是对象，可能是字符串，对象要再取value
      console.log(matchKey);
      return iconClasses[matchKey] instanceof Object ? iconClasses[matchKey].value : iconClasses[matchKey]
    })
    const activeClass = computed(() => {
      //依据当前选中的值，得到从iconclass（数组或对象）中相应的class --> matchClassOrColor
      matchClassOrColor(modelValue,iconClasses)
      console.log('class计算属性');
    })
    const classes = computed(() => {
      const result = [];
      let i = 0;
      let criticalPoint = modelValue.value
      for (; i < criticalPoint; i++){
        console.log(matchClassOrColor());
        result.push(matchClassOrColor()) //我想得到选中效果的icon的class --> activeClass
      }
      for (; i < max.value; i++){
        result.push('el-icon-star-off')
      }
      // console.log(result);
      return result
    })
    const slideSelectRate = (value, event) => {

    }
    const clickUpdateRate = (value) => {
      setRate(value)
    }
    const pressKeyUpdateRate = (e) => {
      let value = modelValue.value
      //增加和减少需要判断临界值
      if(e.keyCode === 38 || e.keyCode === 39){
        value += 1
      }
      if(e.keyCode === 37 || e.keyCode === 40){
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
      // methods
      clickUpdateRate,
      slideSelectRate,
      pressKeyUpdateRate
    }
  }
}
</script>
