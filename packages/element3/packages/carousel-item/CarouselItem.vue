<template>
  <div
    v-show="ready"
    class="el-carousel__item"
    :class="{
      'is-active': active,
      'el-carousel__item--card': parentType === 'card',
      'is-in-stage': inStage,
      'is-hover': hover,
      'is-animating': animating
    }"
    @click="handleItemClick"
    :style="itemStyle"
  >
    <div
      v-if="parentType === 'card'"
      v-show="!active"
      class="el-carousel__mask"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import { autoprefixer } from '../../src/utils/util'
import {
  reactive,
  toRefs,
  computed,
  inject,
  onMounted,
  onUnmounted,
  getCurrentInstance
} from 'vue'
const CARD_SCALE = 0.83
export default {
  name: 'ElCarouselItem',

  props: {
    name: String,
    label: {
      type: [String, Number],
      default: ''
    }
  },

  setup() {
    const parentUpdateItems = inject('updateItems')
    const _this = getCurrentInstance()

    // 更新父组件中的items
    onMounted(() => {
      parentUpdateItems(_this)
    })

    // 初始化data
    const initData = reactive({
      hover: false,
      translate: 0,
      scale: 1,
      active: false,
      ready: false,
      inStage: false,
      animating: false
    })

    const { ready, active, inStage, hover, animating } = toRefs(initData)

    const parentType = inject('type')

    // 处理translateItem，将方法返回到ctx中供父组件调用
    const { parentDirection, translateItem } = useTranslateItem(
      _this,
      initData,
      parentType
    )

    // 处理cardItemClick
    const { handleItemClick } = useCardItemClick(_this, parentType)

    // 处理样式
    const itemStyle = computed(() => {
      const translateType =
        parentDirection.value === 'vertical' ? 'translateY' : 'translateX'
      const value = `${translateType}(${initData.translate}px) scale(${initData.scale})`
      const style = {
        transform: value
      }
      return autoprefixer(style)
    })

    // destoryed的时候更新父组件items
    onUnmounted(() => {
      parentUpdateItems()
    })

    return {
      ready,
      active,
      inStage,
      hover,
      animating,
      itemStyle,
      handleItemClick,
      translateItem,
      parentType
    }
  }
}

const useTranslateItem = (_this, initData, parentType) => {
  const parentItemLength = inject('itemLength')
  const parentDirection = inject('direction')
  const parentLoop = inject('loop')

  const processIndex = (index, activeIndex, length) => {
    if (activeIndex === 0 && index === length - 1) {
      return -1
    } else if (activeIndex === length - 1 && index === 0) {
      return length
    } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
      return length + 1
    } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
      return -2
    }
    return index
  }

  const calcCardTranslate = (index, activeIndex) => {
    const parentWidth = _this.parent.vnode.el.offsetWidth
    if (initData.inStage) {
      return (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4
    } else if (index < activeIndex) {
      return (-(1 + CARD_SCALE) * parentWidth) / 4
    } else {
      return ((3 + CARD_SCALE) * parentWidth) / 4
    }
  }

  const calcTranslate = (index, activeIndex, isVertical) => {
    const distance =
      _this.parent.vnode.el[isVertical ? 'offsetHeight' : 'offsetWidth']
    return distance * (index - activeIndex)
  }

  const translateItem = (index, activeIndex, oldIndex) => {
    const length = parentItemLength.value
    if (parentType.value !== 'card' && oldIndex !== undefined) {
      initData.animating = index === activeIndex || index === oldIndex
    }
    if (index !== activeIndex && length > 2 && parentLoop.value) {
      index = processIndex(index, activeIndex, length)
    }
    if (parentType.value === 'card') {
      if (parentDirection.value === 'vertical') {
        console.warn(
          '[Element Warn][Carousel]vertical direction is not supported in card mode'
        )
      }
      initData.inStage = Math.round(Math.abs(index - activeIndex)) <= 1
      initData.active = index === activeIndex
      initData.translate = calcCardTranslate(index, activeIndex)
      initData.scale = initData.active ? 1 : CARD_SCALE
    } else {
      initData.active = index === activeIndex
      const isVertical = parentDirection.value === 'vertical'
      initData.translate = calcTranslate(index, activeIndex, isVertical)
    }
    initData.ready = true
  }

  return {
    parentDirection,
    translateItem
  }
}

const useCardItemClick = (_this, parentType) => {
  const parentItems = inject('items')
  const setActiveItem = inject('setActiveItem')

  const handleItemClick = () => {
    if (parentType.value === 'card') {
      const index = parentItems.value.indexOf(_this)
      setActiveItem(index)
    }
  }

  return {
    handleItemClick
  }
}
</script>
