<template>
  <div class="el-image">
    <slot v-if="loading" name="placeholder">
      <div class="el-image__placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="el-image__error">{{ t('el.image.error') }}</div>
    </slot>
    <img
      v-else
      class="el-image__inner"
      v-bind="$attrs"
      @click="clickHandler"
      :src="src"
      :style="imageStyle"
      :class="{
        'el-image__inner--center': alignCenter,
        'el-image__preview': preview
      }"
    />
    <template v-if="preview">
      <image-viewer
        :z-index="zIndex"
        :initial-index="imageIndex"
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="previewSrcList"
      />
    </template>
  </div>
</template>

<script>
import ImageViewer from './ImageViewer'
import { t } from 'element-ui/src/locale'
import throttle from 'throttle-debounce/throttle'
import { isString, isHtmlElement } from 'element-ui/src/utils/types'
import {
  on,
  off,
  getScrollContainer,
  isInContainer
} from 'element-ui/src/utils/dom'
import {
  toRefs,
  computed,
  ref,
  unref,
  watch,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount
} from 'vue'

const isSupportObjectFit = () =>
  document.documentElement.style.objectFit !== undefined

const ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
}

let prevOverflow = ''

export default {
  name: 'ElImage',

  inheritAttrs: false,

  components: {
    ImageViewer
  },

  props: {
    src: String,
    fit: String,
    lazy: Boolean,
    scrollContainer: {},
    previewSrcList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    }
  },
  emits: ['error'],
  setup(props, { emit }) {
    const { src, fit, lazy, scrollContainer, previewSrcList, zIndex } = toRefs(
      props
    )
    const loading = ref(true)
    const error = ref(false)
    const show = ref(!lazy)
    const imageWidth = ref(0)
    const imageHeight = ref(0)
    const showViewer = ref(false)
    const self = getCurrentInstance().ctx

    const imageStyle = computed(() => {
      if (
        // ! this.$isServer &&
        fit
      ) {
        return isSupportObjectFit()
          ? { 'object-fit': unref(fit) }
          : getImageStyle(fit)
      }
      return {}
    })

    const alignCenter = computed(() => {
      return (
        // !this.$isServer &&
        !isSupportObjectFit() && fit !== ObjectFit.FILL
      )
    })

    const preview = computed(() => {
      return (
        Array.isArray(previewSrcList.value) && previewSrcList.value.length > 0
      )
    })

    const imageIndex = computed(() => {
      let previewIndex = 0
      const srcIndex = previewSrcList.value.indexOf(src)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    })

    watch(src, () => {
      show.value && loadImage()
    })

    watch(show, (val) => {
      val && loadImage()
    })

    const loadImage = () => {
      // reset status
      loading.value = true
      error.value = false

      const img = new Image()
      img.onload = (e) => handleLoad(e, img)
      img.onerror = handleError()

      // bind html attrs
      // so it can behave consistently
      Object.keys(self.$attrs).forEach((key) => {
        const value = self.$attrs[key]
        img.setAttribute(key, value)
      })
      img.src = unref(src)
    }

    const handleLoad = (e, img) => {
      imageWidth.value = img.width
      imageHeight.value = img.height
      loading.value = false
      error.value = false
    }

    const handleError = (e) => {
      loading.value = false
      error.value = true
      emit('error', e)
    }

    const handleLazyLoad = () => {
      if (isInContainer(self.$el, self._scrollContainer)) {
        show.value = true
        removeLazyLoadListener()
      }
    }

    const addLazyLoadListener = () => {
      // if (this.$isServer) return

      let _scrollContainer = null

      if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer
      } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer)
      } else {
        _scrollContainer = getScrollContainer(self.$el)
      }

      if (_scrollContainer) {
        self._scrollContainer = _scrollContainer
        self._lazyLoadHandler = throttle(200, handleLazyLoad)
        on(_scrollContainer, 'scroll', self._lazyLoadHandler)
        handleLazyLoad()
      }
    }

    const removeLazyLoadListener = () => {
      const { _scrollContainer, _lazyLoadHandler } = self

      if (
        // this.$isServer ||
        !_scrollContainer ||
        !_lazyLoadHandler
      )
        return

      off(_scrollContainer, 'scroll', self._lazyLoadHandler)
      self._scrollContainer = null
      self._lazyLoadHandler = null
    }

    const getImageStyle = (fit) => {
      const {
        clientWidth: containerWidth,
        clientHeight: containerHeight
      } = self.$el

      if (
        !imageWidth.value ||
        !imageHeight.value ||
        !containerWidth ||
        !containerHeight
      )
        return {}

      const vertical = imageWidth.value / imageHeight.value < 1

      if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller =
          imageWidth.value < containerWidth &&
          imageHeight.value < containerHeight
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
      }

      switch (fit) {
        case ObjectFit.NONE:
          return { width: 'auto', height: 'auto' }
        case ObjectFit.CONTAIN:
          return vertical ? { width: 'auto' } : { height: 'auto' }
        case ObjectFit.COVER:
          return vertical ? { height: 'auto' } : { width: 'auto' }
        default:
          return {}
      }
    }

    const clickHandler = () => {
      // don't show viewer when preview is false
      if (!preview) {
        return
      }
      // prevent body scroll
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      showViewer.value = true
    }

    const closeViewer = () => {
      document.body.style.overflow = prevOverflow
      showViewer.value = false
    }

    onMounted(() => {
      if (lazy.value) {
        addLazyLoadListener()
      } else {
        loadImage()
      }
    })

    onBeforeUnmount(() => {
      lazy && removeLazyLoadListener()
    })

    return {
      t,
      src,
      previewSrcList,
      zIndex,
      loading,
      error,
      showViewer,
      imageStyle,
      alignCenter,
      preview,
      imageIndex,
      clickHandler,
      closeViewer,
      show
    }
  }
}
</script>
