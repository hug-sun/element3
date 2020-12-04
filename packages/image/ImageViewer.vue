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
          :class="{ 'is-disabled': isFirst }"
          @click="prev"
        >
          <i class="el-icon-arrow-left" />
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'is-disabled': isLast }"
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
          <i
            :class="state.mode.icon"
            class="el-image-viewer-toggle-btn"
            @click="toggleMode"
          ></i>
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
import { reactive, computed, ref, watch, onMounted } from 'vue'
import useRef from './use/useRef'

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
    const imageWrapper = ref(null)

    const [loading, setLoading] = useRef(false)
    const index = ref(props.initialIndex)

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

    const { currentImg, currentIndex, changeCurrentImage } = useCurrentImage(
      props.initialIndex,
      props.urlList
    )
    // computed
    const isSingle = useSingle(props.urlList)
    const isFirst = useFirstImage(currentIndex)
    const isLast = useIsLastImage(currentIndex, props.urlList)
    const imgStyle = useImgStyle(state)
    // lifeC
    onMounted(() => {
      deviceSupportInstall()
      // add tabindex then wrapper can be focusable via Javascript
      // focus wrapper so arrow key can't cause inner scroll behavior underneath
      focusImageWrapper()
    })

    const focusImageWrapper = () => imageWrapper.value.focus()
    // watch
    watch(index, (val) => {
      reset()
      changeCurrentImage(val)
    })

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
      if (isFirst.value) return
      const len = props.urlList.length
      index.value = (index.value - 1 + len) % len
    }
    const next = () => {
      if (isLast.value) return
      const len = props.urlList.length
      index.value = (index.value + 1) % len
    }

    let keyDownHandler = rafThrottle((e) => {
      const keyCode = e.keyCode
      const actions = {
        27: () => hide(), // ESC
        32: () => toggleMode(), // SPACE
        37: () => prev(), // LEFT_ARROW
        38: () => handleActions('zoomIn'), // UP_ARROW
        39: () => next(), // RIGHT_ARROW
        40: () => handleActions('zoomOut') // DOWN_ARROW
      }

      actions[keyCode] && actions[keyCode]()
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
      setLoading(false)
    }
    const handleImgError = (e) => {
      setLoading(false)
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
      imageWrapper,
      loading,
      state,
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

const useImgStyle = (state) => {
  return computed(() => {
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
}

const useCurrentImage = (initialIndex, urlList) => {
  const currentIndex = ref(initialIndex)
  const currentImg = computed(() => urlList[currentIndex.value])
  const changeCurrentImage = (index) => (currentIndex.value = index)
  return {
    currentImg,
    currentIndex,
    changeCurrentImage
  }
}

const useSingle = (urlList) => {
  return computed(() => urlList.length <= 1)
}

const useFirstImage = (currentIndex) => {
  return computed(() => currentIndex.value === 0)
}

const useIsLastImage = (currentIndex, urlList) => {
  return computed(() => currentIndex.value === urlList.length - 1)
}
</script>
