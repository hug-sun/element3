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
      :style="imageStyle"
      :src="src"
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
import { loadImage, objectFit } from './uitls/utils'
import { useImageStyle } from './use/useImageStyle'
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
  getCurrentInstance,
  toRaw
} from 'vue'

const isSupportObjectFit = () =>
  document.documentElement.style.objectFit !== undefined

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

  emits: ['error', 'load'],

  setup(props, ctx) {
    const instance = getCurrentInstance()
    const loading = ref(true)
    const error = ref(false)
    const show = ref(!props.lazy)
    const showViewer = ref(false)

    // computed
    const imageStyle = computed(() => {
      const { fit } = props
      if (fit) {
        return isSupportObjectFit()
          ? { 'object-fit': fit }
          : useImageStyle(instance.ctx.$el, fit)
      }
      return {}
    })

    const alignCenter = computed(() => {
      return !isSupportObjectFit() && props.fit !== objectFit.FILL
    })
    const preview = computed(() => {
      const { previewSrcList } = props
      return Array.isArray(previewSrcList) && previewSrcList.length > 0
    })
    const imageIndex = computed(() => {
      const { previewSrcList, src } = toRaw(props)
      return previewSrcList.indexOf(src) >= 0 ? previewSrcList.indexOf(src) : 0
    })

    watch([() => props.src, show], ([src, show]) => {
      ;(show.value || src) &&
        loadImage(
          props.src,
          instance.ctx.$attrs,
          handleLoad,
          handleError.bind(this)
        )
    })

    // lifecycle
    onMounted(() => {
      if (props.lazy) {
        addLazyLoadListener()
        onBeforeUnmount(() => {
          console.log(8888)
        })
      } else {
        loadImage(
          props.src,
          instance.ctx.$attrs,
          handleLoad,
          handleError.bind(this)
        )
      }
    })
    onBeforeUnmount(() => {
      props.lazy && removeLazyLoadListener()
    })

    const handleLoad = () => {
      loading.value = false
      error.value = false
    }
    const handleError = (e) => {
      loading.value = false
      error.value = true
      ctx.emit('error', e)
    }
    const handleLazyLoad = () => {
      if (isInContainer(instance.ctx.$el, instance.ctx._scrollContainer)) {
        show.value = true
        removeLazyLoadListener()
      }
    }
    const addLazyLoadListener = () => {
      const { scrollContainer } = props
      let _scrollContainer = null

      if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer
      } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer)
      } else {
        _scrollContainer = getScrollContainer(instance.ctx.$el)
      }

      if (_scrollContainer) {
        instance.ctx._scrollContainer = _scrollContainer
        instance.ctx._lazyLoadHandler = throttle(200, handleLazyLoad)
        on(_scrollContainer, 'scroll', instance.ctx._lazyLoadHandler)
        handleLazyLoad()
      }
    }
    const removeLazyLoadListener = () => {
      const { _scrollContainer, _lazyLoadHandler } = instance.ctx

      if (!_scrollContainer || !_lazyLoadHandler) {
        return
      }

      off(_scrollContainer, 'scroll', _lazyLoadHandler)
      instance.ctx._scrollContainer = null
      instance.ctx._lazyLoadHandler = null
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
      imageStyle,
      alignCenter,
      preview,
      imageIndex,
      handleLoad,
      handleError,
      handleLazyLoad,
      addLazyLoadListener,
      removeLazyLoadListener,
      clickHandler,
      closeViewer,
      t
    }
  }
}
</script>
