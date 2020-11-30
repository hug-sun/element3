<template>
  <transition name="viewer-fade">
    <div
      tabindex="-1"
      ref="imageWrapper"
      class="el-image-viewer__wrapper"
      :style="{ 'z-index': zIndex }"
    >
      <div class="el-image-viewer__mask"></div>
      <!-- CLOSE -->
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide">
        <i class="el-icon-circle-close"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          <i class="el-icon-arrow-left" />
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          <i class="el-icon-arrow-right" />
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <i class="el-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="el-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i :class="state.mode.icon" @click="toggleMode"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i
            class="el-icon-refresh-left"
            @click="handleActions('anticlocelise')"
          ></i>
          <i
            class="el-icon-refresh-right"
            @click="handleActions('clocelise')"
          ></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas">
        <img
          ref="img"
          class="el-image-viewer__img"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from '../../src/utils/dom'
import { rafThrottle, isFirefox } from '../../src/utils/util'
import { reactive, computed, ref, watch, nextTick, onMounted } from 'vue'
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
}
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'
export default {
  name: 'elImageViewer',
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const img = ref(null)
    const imageWrapper = ref(null)
    // data
    const state = reactive({
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    })
    const index = ref(props.initialIndex)
    let loading = ref(false)
    const infinite = ref(true)
    const isShow = ref(true)
    // computed
    const isSingle = computed(() => props.urlList.length <= 1)
    const isFirst = computed(() => props.index === 0)
    const isLast = computed(() => props.index === props.urlList.length - 1)
    const currentImg = computed(() => props.urlList[index.value])
    const imgStyle = computed(() => {
      const { scale, deg, offsetX, offsetY, enableTransition } = state.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (state.mode.name === Mode.CONTAIN.name) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    })
    // lifeC
    onMounted(() => {
      deviceSupportInstall()
      // add tabindex then wrapper can be focusable via Javascript
      // focus wrapper so arrow key can't cause inner scroll behavior underneath
      imageWrapper.value.focus()
    })
    // watch
    watch(index, (val) => {
      reset()
      props.onSwitch(val)
    })
    watch(currentImg, () => {
      nextTick(() => {
        if (img.value.complete) {
          loading = true
        }
      })
    })
    // methods
    const handleActions = (action, options = {}) => {
      if (loading.value) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      switch (action) {
        case 'zoomOut':
          if (state.transform.scale > 0.2) {
            state.transform.scale = parseFloat(
              (state.transform.scale - zoomRate).toFixed(3)
            )
          }
          break
        case 'zoomIn':
          state.transform.scale = parseFloat(
            (state.transform.scale + zoomRate).toFixed(3)
          )
          break
        case 'clocelise':
          state.transform.deg += rotateDeg
          break
        case 'anticlocelise':
          state.transform.deg -= rotateDeg
          break
      }
      state.transform.enableTransition = enableTransition
    }
    const reset = () => {
      state.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    }
    const toggleMode = () => {
      if (loading.value) return
      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.findIndex(
        (index) => index.name === state.mode.name
      )
      const nextIndex = (index + 1) % modeNames.length
      state.mode = Mode[modeNames[nextIndex]]
      reset()
    }
    const prev = () => {
      if (isFirst.value && !infinite.value) return
      const len = props.urlList.length
      index.value = (index.value - 1 + len) % len
    }
    const next = () => {
      if (isLast.value && !infinite.value) return
      const len = props.urlList.length
      index.value = (index.value + 1) % len
    }
    let keyDownHandler = rafThrottle((e) => {
      const keyCode = e.keyCode
      switch (keyCode) {
        // ESC
        case 27:
          hide()
          break
        // SPACE
        case 32:
          toggleMode()
          break
        // LEFT_ARROW
        case 37:
          prev()
          break
        // UP_ARROW
        case 38:
          handleActions('zoomIn')
          break
        // RIGHT_ARROW
        case 39:
          next()
          break
        // DOWN_ARROW
        case 40:
          handleActions('zoomOut')
          break
      }
    })
    let mouseWheelHandler = rafThrottle((e) => {
      const delta = e.wheelDelta ? e.wheelDelta : -e.detail
      if (delta > 0) {
        handleActions('zoomIn', {
          zoomRate: 0.015,
          enableTransition: false
        })
      } else {
        handleActions('zoomOut', {
          zoomRate: 0.015,
          enableTransition: false
        })
      }
    })
    const deviceSupportInstall = () => {
      on(document, 'keydown', keyDownHandler)
      on(document, mousewheelEventName, mouseWheelHandler)
    }
    const deviceSupportUninstall = () => {
      off(document, 'keydown', keyDownHandler)
      off(document, mousewheelEventName, mouseWheelHandler)
      keyDownHandler = null
      mouseWheelHandler = null
    }
    const hide = () => {
      deviceSupportUninstall()
      props.onClose()
    }
    const handleImgLoad = () => {
      loading = false
    }
    const handleImgError = (e) => {
      loading = false
      e.target.alt = '加载失败'
    }
    const handleMouseDown = (e) => {
      if (loading || e.button !== 0) return
      const { offsetX, offsetY } = state.transform
      const startX = e.pageX
      const startY = e.pageY
      const _dragHandler = rafThrottle((ev) => {
        state.transform.offsetX = offsetX + ev.pageX - startX
        state.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', _dragHandler)
      on(document, 'mouseup', () => {
        off(document, 'mousemove', _dragHandler)
      })
      e.preventDefault()
    }
    return {
      img,
      imageWrapper,
      loading,
      isShow,
      state,
      infinite,
      index,
      isSingle,
      isFirst,
      isLast,
      currentImg,
      imgStyle,
      reset,
      next,
      prev,
      toggleMode,
      handleActions,
      hide,
      keyDownHandler,
      mouseWheelHandler,
      deviceSupportInstall,
      deviceSupportUninstall,
      handleImgLoad,
      handleImgError,
      handleMouseDown
    }
  }
}
</script>
