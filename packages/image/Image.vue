<template>
  <div :class="['el-image', $attrs.class]"  :style="$attrs.style">
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
import {useGlobalOptions} from '../../src/use/globalConfig'
import { loadImage, objectFit } from './uitls/utils'
import { useImageStyle } from './use/useImageStyle'
import { t } from '../../src/locale'
import { throttle } from 'throttle-debounce'
import { isString, isHtmlElement } from '../../src/utils/types'
import { on, off, getScrollContainer, isInContainer } from '../../src/utils/dom'
import {
  ref,
  toRaw,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance
} from 'vue'

import useRef from './use/useRef'

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
  emits: ['error'],
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const [loading, setLoading] = useRef(true)
    const [error, setError] = useRef(false)
    const [show, setShow] = useRef(!props.lazy)
    const [showViewer, setShowViewer] = useRef(false)

 
    const imageStyle = useImageFix(props.fit)

    const alignCenter = useAlign(props, objectFit)

    const preview = usePreviewStatus(props.previewSrcList)

    const imageIndex = useImageIndex(props)

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
      setLoading(false)
      setError(false)
    }
    const handleError = (e) => {
      setLoading(false)
      setError(true)
      ctx.emit('error', e)
    }
    const handleLazyLoad = () => { 
      if (isInContainer(instance.ctx.$el, instance.ctx._scrollContainer)) {
        setShow(true)
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
      if (
        // this.$isServer ||
        !_scrollContainer ||
        !_lazyLoadHandler
      )
        return
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
      setShowViewer(true)
    }
    const closeViewer = () => {
      document.body.style.overflow = prevOverflow
      setShowViewer(false)
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

const usePreviewStatus = (previewSrcList) => {
  return computed(() => {
    return Array.isArray(previewSrcList) && previewSrcList.length > 0
  })
}

const useImageIndex = (props) => {
  return computed(() => {
    const { previewSrcList, src } = toRaw(props)
    return previewSrcList.indexOf(src) >= 0 ? previewSrcList.indexOf(src) : 0
  })
}

const useAlign = (props, objectFit) => {
  return computed(() => {
    return !isSupportObjectFit() && props.fit !== objectFit.FILL
  })
}

const useImageFix = (fit) => {
  return computed(() => {
      if (fit) { 
        return isSupportObjectFit()
          ? { 'object-fit': fit }
          : useImageStyle(useGlobalOptions(), fit)
      }
      return {}
    })
}

</script>
