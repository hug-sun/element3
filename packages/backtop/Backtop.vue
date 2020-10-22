<template>
  <transition name="el-fade-in">
    <div
      v-if="visible"
      @click.stop="handleClick"
      :style="{
        right: styleRight,
        bottom: styleBottom
      }"
      class="el-backtop"
    >
      <slot>
        <el-icon name="caret-top"></el-icon>
      </slot>
    </div>
  </transition>
</template>

<script>
import { ref, toRefs, computed, onMounted, onUnmounted } from 'vue'
import { throttle } from 'throttle-debounce'
import ElIcon from '../icon'
const cubic = (value) => Math.pow(value, 3)
const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2

export default {
  name: 'ElBacktop',
  components: {
    ElIcon
  },
  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    target: {
      type: String,
      default: null
    },
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  },

  setup(props, { emit }) {
    const el = ref(null)
    const container = ref(null)
    const visible = ref(null)
    let throttledScrollHandler

    const { visibilityHeight, target, right, bottom } = toRefs(props)

    const styleBottom = computed(() => `${bottom.value}px`)
    const styleRight = computed(() => `${right.value}px`)

    const init = () => {
      container.value = document
      el.value = document.documentElement
      if (target.value) {
        el.value = document.querySelector(target.value)
        if (!el.value) {
          throw new Error(`target is not existed: ${target.value}`)
        }
        container.value = el.value
      }
    }

    const onScroll = () => {
      const scrollTop = el.value.scrollTop
      visible.value = scrollTop >= visibilityHeight.value
    }

    const handleClick = (e) => {
      scrollToTop()
      emit('click', e)
    }

    const scrollToTop = () => {
      const element = el.value
      const beginTime = Date.now()
      const beginValue = element.scrollTop
      const rAF =
        window.requestAnimationFrame || ((func) => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500
        if (progress < 1) {
          element.scrollTop = beginValue * (1 - easeInOutCubic(progress))
          rAF(frameFunc)
        } else {
          element.scrollTop = 0
        }
      }
      rAF(frameFunc)
    }

    onMounted(() => {
      init()
      throttledScrollHandler = throttle(300, onScroll)
      container.value.addEventListener('scroll', throttledScrollHandler)
    })

    onUnmounted(() => {
      container.value.removeEventListener('scroll', throttledScrollHandler)
    })

    return {
      visible,
      styleBottom,
      styleRight,
      handleClick
    }
  }
}
</script>
