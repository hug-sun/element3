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
import { t } from '../../src/locale'
import { throttle } from 'throttle-debounce'
import { isString, isHtmlElement } from '../../src/utils/types'
import { on, off, getScrollContainer, isInContainer } from '../../src/utils/dom'
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance
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

  setup(props, ctx) {
    const instance = getCurrentInstance()
    const loading = ref(true)
    const error = ref(false)
    const show = ref(!props.lazy)
    const showViewer = ref(false)
    const imageWidth = ref(0)
    const imageHeight = ref(0)
    // computed
    const imageStyle = computed(() => {
      const { fit } = props
      if (
        //! this.$isServer &&
        fit
      ) {
        return isSupportObjectFit() ? { 'object-fit': fit } : getImageStyle(fit)
      }
      return {}
    })
    const alignCenter = computed(() => {
      return (
        // !this.$isServer &&
        !isSupportObjectFit() && props.fit !== ObjectFit.FILL
      )
    })
    const preview = computed(() => {
      const { previewSrcList } = props
      return Array.isArray(previewSrcList) && previewSrcList.length > 0
    })
    const imageIndex = computed(() => {
      let previewIndex = 0
      const srcIndex = props.previewSrcList.indexOf(props.src)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    })
    // watch
    watch(
      () => props.src,
      () => {
        show.value && loadImage()
      }
    )
    watch(show, (val) => {
      val && loadImage()
    })
    // lifecycle
    onMounted(() => {
      if (props.lazy) {
        addLazyLoadListener()
      } else {
        loadImage()
      }
    })
    onBeforeUnmount(() => {
      props.lazy && removeLazyLoadListener()
    })
    // methods
    const loadImage = () => {
      // if (this.$isServer) return
      // reset status
      loading.value = true
      error.value = false
      const img = new Image()
      img.onload = (e) => handleLoad(e, img)
      img.onerror = handleError.bind(this)
      // bind html attrs
      // so it can behave consistently
      Object.keys(instance.proxy.$attrs).forEach((key) => {
        const value = instance.proxy.$attrs[key]
        img.setAttribute(key, value)
      })
      img.src = props.src
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
      ctx.emit('error', e)
    }
    const handleLazyLoad = () => {
      if (isInContainer(instance.proxy.$el, instance.proxy._scrollContainer)) {
        show.value = true
        removeLazyLoadListener()
      }
    }
    const addLazyLoadListener = () => {
      // if (this.$isServer) return
      const { scrollContainer } = props
      let _scrollContainer = null
      if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer
      } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer)
      } else {
        _scrollContainer = getScrollContainer(instance.proxy.$el)
      }
      if (_scrollContainer) {
        instance.proxy._scrollContainer = _scrollContainer
        instance.proxy._lazyLoadHandler = throttle(200, handleLazyLoad)
        on(_scrollContainer, 'scroll', instance.proxy._lazyLoadHandler)
        handleLazyLoad()
      }
    }
    const removeLazyLoadListener = () => {
      const { _scrollContainer, _lazyLoadHandler } = instance.proxy
      if (
        // this.$isServer ||
        !_scrollContainer ||
        !_lazyLoadHandler
      )
        return
      off(_scrollContainer, 'scroll', _lazyLoadHandler)
      instance.proxy._scrollContainer = null
      instance.proxy._lazyLoadHandler = null
    }
    /**
     * simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
     */
    const getImageStyle = (fit) => {
      const {
        clientWidth: containerWidth,
        clientHeight: containerHeight
      } = instance.proxy.$el
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
      if (!preview.value) {
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
    return {
      loading,
      error,
      show,
      showViewer,
      imageWidth,
      imageHeight,
      imageStyle,
      alignCenter,
      preview,
      imageIndex,
      loadImage,
      handleLoad,
      handleError,
      handleLazyLoad,
      getImageStyle,
      addLazyLoadListener,
      removeLazyLoadListener,
      clickHandler,
      closeViewer,
      t
    }
  }
}
</script>
