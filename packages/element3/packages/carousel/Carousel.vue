<template>
  <div
    :class="carouselClasses"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <div class="el-carousel__container" :style="{ height: height }">
      <transition v-if="arrowDisplay" name="carousel-arrow-left">
        <button
          type="button"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
          class="el-carousel__arrow el-carousel__arrow--left"
        >
          <i class="el-icon-arrow-left"></i>
        </button>
      </transition>
      <transition v-if="arrowDisplay" name="carousel-arrow-right">
        <button
          type="button"
          v-show="
            (arrow === 'always' || hover) &&
            (loop || activeIndex < items.length - 1)
          "
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
          class="el-carousel__arrow el-carousel__arrow--right"
        >
          <i class="el-icon-arrow-right"></i>
        </button>
      </transition>
      <slot></slot>
    </div>
    <ul v-if="indicatorPosition !== 'none'" :class="indicatorsClasses">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'el-carousel__indicator',
          'el-carousel__indicator--' + direction,
          { 'is-active': index === activeIndex }
        ]"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)"
      >
        <button class="el-carousel__button">
          <span v-if="hasLabel">{{ item.proxy.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  ref,
  toRefs,
  computed,
  watch,
  reactive,
  nextTick,
  provide,
  onMounted,
  onUnmounted
} from 'vue'
import { throttle } from 'throttle-debounce'
import { useResizeEvent } from '../../src/utils/resize-event'

export default {
  name: 'ElCarousel',

  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    height: String,
    trigger: {
      type: String,
      default: 'hover'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    indicatorPosition: String,
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: String,
      default: 'hover'
    },
    type: String,
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1
      }
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    // 初始化状态
    const initData = reactive({
      items: [],
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false
    })

    // 封装ArrowButton逻辑
    const {
      loop,
      arrowDisplay,
      handleButtonEnter,
      handleButtonLeave,
      throttledArrowClick,
      setActiveItem,
      resetItemPosition
    } = useArrowButton(props, initData)

    // 封装Indicator逻辑
    const {
      hasLabel,
      indicatorsClasses,
      throttledIndicatorHover,
      handleIndicatorClick
    } = useIndicator(props, initData)

    // 初始化Slide
    const {
      carouselClasses,
      handleMouseEnter,
      handleMouseLeave,
      startTimer
    } = useInitSlide(props, initData, loop)

    const updateItems = (ElCarouselItem) => {
      initData.items.push(ElCarouselItem)
    }

    const { addResizeListener, removeResizeListener } = useResizeEvent()

    onMounted(() => {
      nextTick(() => {
        addResizeListener(resetItemPosition)
        if (
          props.initialIndex < initData.items.length &&
          props.initialIndex >= 0
        ) {
          initData.activeIndex = props.initialIndex
        }
        startTimer()
      })
    })

    onUnmounted(() => {
      removeResizeListener(resetItemPosition)
    })

    watch(
      () => initData.items,
      (val) => {
        if (val.length > 0) setActiveItem(props.initialIndex)
      }
    )

    watch(
      () => initData.activeIndex,
      (val, oldVal) => {
        resetItemPosition(oldVal)
        if (oldVal > -1) {
          emit('change', val, oldVal)
        }
      }
    )

    // 暴露方法
    const prev = () => {
      setActiveItem(initData.activeIndex - 1)
    }

    const next = () => {
      setActiveItem(initData.activeIndex + 1)
    }

    // 取出视图所需参数
    const { items, activeIndex, hover } = toRefs(initData)

    /**
     * 向CarouselItem提供属性及方法
     */
    // 通过computed将props中的direction字符串变成响应式
    const computedDirection = computed(() => {
      return props.direction
    })

    const computedType = computed(() => {
      return props.type
    })

    const computedItems = computed(() => {
      return initData.items
    })

    const computedItemLength = computed(() => {
      return initData.items.length
    })

    const computedLoop = computed(() => {
      return props.loop
    })

    // 只提供计算出来的值，不允许子组件借此改变数据流向
    provide('direction', computedDirection)
    provide('type', computedType)
    provide('items', computedItems)
    provide('itemLength', computedItemLength)
    provide('loop', computedLoop)

    // 提供改变状态的方法
    provide('updateItems', updateItems)
    provide('setActiveItem', setActiveItem)

    return {
      items,
      activeIndex,
      hover,
      arrowDisplay,
      handleButtonEnter,
      handleButtonLeave,
      throttledArrowClick,
      hasLabel,
      indicatorsClasses,
      throttledIndicatorHover,
      handleIndicatorClick,
      carouselClasses,
      handleMouseEnter,
      handleMouseLeave,
      prev,
      next,
      setActiveItem
    }
  }
}

const useArrowButton = (props, initData) => {
  const loop = ref(props.loop)

  const itemInStage = (item, index) => {
    const length = initData.items.length
    if (
      (index === length - 1 &&
        item.proxy.inStage &&
        initData.items[0].active) ||
      (item.proxy.inStage &&
        initData.items[index + 1] &&
        initData.items[index + 1].active)
    ) {
      return 'left'
    } else if (
      (index === 0 &&
        item.proxy.inStage &&
        initData.items[length - 1].active) ||
      (item.proxy.inStage &&
        initData.items[index - 1] &&
        initData.items[index - 1].active)
    ) {
      return 'right'
    }
    return false
  }

  const resetItemPosition = (oldIndex) => {
    initData.items.forEach((item, index) => {
      item.proxy.translateItem(index, initData.activeIndex, oldIndex)
    })
  }

  const setActiveItem = (index) => {
    if (typeof index === 'string') {
      const filteredItems = initData.items.filter(
        (item) => item.proxy.name === index
      )
      if (filteredItems.length > 0) {
        index = initData.items.indexOf(filteredItems[0])
      }
    }
    index = Number(index)
    if (isNaN(index) || index !== Math.floor(index)) {
      console.warn('[Element Warn][Carousel]index must be an integer.')
      return
    }
    const length = initData.items.length
    const oldIndex = initData.activeIndex
    if (index < 0) {
      initData.activeIndex = loop.value ? length - 1 : 0
    } else if (index >= length) {
      initData.activeIndex = loop.value ? 0 : length - 1
    } else {
      initData.activeIndex = index
    }
    if (oldIndex === initData.activeIndex) {
      resetItemPosition(oldIndex)
    }
  }

  const throttledArrowClick = throttle(300, true, (index) => {
    setActiveItem(index)
  })

  const handleButtonEnter = (arrow) => {
    if (props.direction === 'vertical') return
    initData.items.forEach((item, index) => {
      if (arrow === itemInStage(item, index)) {
        item.proxy.hover = true
      }
    })
  }

  const handleButtonLeave = () => {
    if (props.direction === 'vertical') return
    initData.items.forEach((item) => {
      item.proxy.hover = false
    })
  }

  const arrowDisplay = computed(() => {
    return props.arrow !== 'never' && props.direction !== 'vertical'
  })

  watch(loop, () => {
    setActiveItem(initData.activeIndex)
  })

  return {
    loop,
    arrowDisplay,
    handleButtonEnter,
    handleButtonLeave,
    throttledArrowClick,
    setActiveItem,
    resetItemPosition
  }
}

const useIndicator = (props, initData) => {
  const handleIndicatorHover = (index) => {
    if (props.trigger === 'hover' && index !== initData.activeIndex) {
      initData.activeIndex = index
    }
  }
  const throttledIndicatorHover = throttle(300, (index) => {
    handleIndicatorHover(index)
  })

  const handleIndicatorClick = (index) => {
    initData.activeIndex = index
  }

  const hasLabel = computed(() => {
    return initData.items.some((item) => item.proxy.label.toString().length > 0)
  })

  const indicatorsClasses = computed(() => {
    const classes = [
      'el-carousel__indicators',
      'el-carousel__indicators--' + props.direction
    ]
    if (hasLabel.value) {
      classes.push('el-carousel__indicators--labels')
    }
    if (props.indicatorPosition === 'outside' || props.type === 'card') {
      classes.push('el-carousel__indicators--outside')
    }
    return classes
  })

  return {
    throttledIndicatorHover,
    handleIndicatorClick,
    hasLabel,
    indicatorsClasses
  }
}

const useInitSlide = (props, initData, loop) => {
  const autoplay = ref(props.autoplay)

  const playSlides = () => {
    if (initData.activeIndex < initData.items.length - 1) {
      initData.activeIndex++
    } else if (loop.value) {
      initData.activeIndex = 0
    }
  }

  const startTimer = () => {
    if (props.interval <= 0 || !autoplay.value || initData.timer) return
    initData.timer = setInterval(playSlides, props.interval)
  }

  const pauseTimer = () => {
    if (initData.timer) {
      clearInterval(initData.timer)
      initData.timer = null
    }
  }

  const handleMouseEnter = () => {
    initData.hover = true
    pauseTimer()
  }

  const handleMouseLeave = () => {
    initData.hover = false
    startTimer()
  }

  const carouselClasses = computed(() => {
    const classes = ['el-carousel', 'el-carousel--' + props.direction]
    if (initData.type === 'card') {
      classes.push('el-carousel--card')
    }
    return classes
  })

  watch(autoplay, (val) => {
    val ? startTimer() : pauseTimer()
  })

  return {
    carouselClasses,
    playSlides,
    startTimer,
    handleMouseEnter,
    handleMouseLeave
  }
}
</script>
