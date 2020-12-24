import { onMounted, onUnmounted, computed, ref, watchEffect, watch } from 'vue'
import {
  addResizeListener,
  removeResizeListener
} from '../../../../src/utils/resize-event'
import { throttle } from 'lodash-es'
import { parseHeight } from '../util'

function useStyle(props, layout, store, table, doLayout) {
  const isHidden = ref(false)
  const renderExpanded = ref(null)
  const resizeProxyVisible = ref(false)
  const setDragVisible = (visible) => {
    resizeProxyVisible.value = visible
  }
  const resizeState = ref({
    width: null,
    height: null
  })
  const isGroup = ref(false)
  const scrollPosition = ref('left')

  watchEffect(() => {
    layout.setHeight(props.height)
  })
  watchEffect(() => {
    layout.setMaxHeight(props.maxHeight)
  })
  watchEffect(() => {
    if (!store.states.rowKey.value) return
    store.setCurrentRowKey(props.currentRowKey)
  })
  watch(
    () => props.data,
    () => {
      table.store.commit('setData', props.data)
    },
    {
      immediate: true
    }
  )
  watchEffect(() => {
    if (props.expandRowKeys) {
      store.setExpandRowKeysAdapter(props.expandRowKeys)
    }
  })

  const handleMouseLeave = () => {
    table.store.commit('setHoverRow', null)
    if (table.hoverState) table.hoverState = null
  }

  const handleHeaderFooterMousewheel = (event, data) => {
    const { pixelX, pixelY } = data
    if (Math.abs(pixelX) >= Math.abs(pixelY)) {
      table.refs.bodyWrapper.scrollLeft += data.pixelX / 5
    }
  }

  const shouldUpdateHeight = computed(() => {
    return (
      props.height ||
      props.maxHeight ||
      store.states.fixedColumns.value.length > 0 ||
      store.states.rightFixedColumns.value.length > 0
    )
  })
  onMounted(() => {
    bindEvents()
    store.updateColumns()
    doLayout()

    resizeState.value = {
      width: table.vnode.el.offsetWidth,
      height: table.vnode.el.offsetHeight
    }

    // init filters
    store.states.columns.value.forEach((column) => {
      if (column.filteredValue && column.filteredValue.length) {
        table.store.commit('filterChange', {
          column,
          values: column.filteredValue,
          silent: true
        })
      }
    })
    table.$ready = true
  })
  const syncPostion = throttle(function () {
    const {
      scrollLeft,
      scrollTop,
      offsetWidth,
      scrollWidth
    } = table.refs.bodyWrapper
    const {
      headerWrapper,
      footerWrapper,
      fixedBodyWrapper,
      rightFixedBodyWrapper
    } = table.refs
    if (headerWrapper) headerWrapper.scrollLeft = scrollLeft
    if (footerWrapper) footerWrapper.scrollLeft = scrollLeft
    if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop
    if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop
    const maxScrollLeftPosition = scrollWidth - offsetWidth - 1
    if (scrollLeft >= maxScrollLeftPosition) {
      scrollPosition.value = 'right'
    } else if (scrollLeft === 0) {
      scrollPosition.value = 'left'
    } else {
      scrollPosition.value = 'middle'
    }
  }, 20)
  const bindEvents = () => {
    table.refs.bodyWrapper.addEventListener('scroll', syncPostion, {
      passive: true
    })
    if (props.fit) {
      addResizeListener(table.vnode.el, resizeListener)
    }
  }
  onUnmounted(() => {
    unbindEvents()
  })
  const unbindEvents = () => {
    table.refs.bodyWrapper?.removeEventListener('scroll', syncPostion, true)
    if (props.fit) {
      removeResizeListener(table.vnode.el, resizeListener)
    }
  }
  const resizeListener = () => {
    if (!table.$ready) return
    let shouldUpdateLayout = false
    const el = table.vnode.el
    const { width: oldWidth, height: oldHeight } = resizeState.value

    const width = el.offsetWidth
    if (oldWidth !== width) {
      shouldUpdateLayout = true
    }

    const height = el.offsetHeight
    if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
      shouldUpdateLayout = true
    }

    if (shouldUpdateLayout) {
      resizeState.value = {
        width,
        height
      }
      doLayout()
    }
  }
  const tableSize = computed(() => {
    return props.size
  })
  const bodyWidth = computed(() => {
    const { bodyWidth: bodyWidth_, scrollY, gutterWidth } = layout
    return bodyWidth_.value
      ? bodyWidth_.value - (scrollY.value ? gutterWidth : 0) + 'px'
      : ''
  })
  const bodyHeight = computed(() => {
    const headerHeight = layout.headerHeight.value || 0
    const bodyHeight = layout.bodyHeight.value
    const footerHeight = layout.footerHeight.value || 0
    if (props.height) {
      return {
        height: bodyHeight ? bodyHeight + 'px' : ''
      }
    } else if (props.maxHeight) {
      const maxHeight = parseHeight(props.maxHeight)
      if (typeof maxHeight === 'number') {
        return {
          'max-height':
            maxHeight -
            footerHeight -
            (props.showHeader ? headerHeight : 0) +
            'px'
        }
      }
    }
    return {}
  })
  const emptyBlockStyle = computed(() => {
    if (props.data && props.data.length) return null
    let height = '100%'
    if (layout.appendHeight.value) {
      height = `calc(100% - ${layout.appendHeight.value}px)`
    }
    return {
      width: bodyWidth.value,
      height
    }
  })
  /**
   * fix layout
   */
  const handleFixedMousewheel = (event, data) => {
    const bodyWrapper = table.refs.bodyWrapper
    if (Math.abs(data.spinY) > 0) {
      const currentScrollTop = bodyWrapper.scrollTop
      if (data.pixelY < 0 && currentScrollTop !== 0) {
        event.preventDefault()
      }
      if (
        data.pixelY > 0 &&
        bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop
      ) {
        event.preventDefault()
      }
      bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5)
    } else {
      bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5)
    }
  }
  const fixedHeight = computed(() => {
    if (props.maxHeight) {
      if (props.showSummary) {
        return {
          bottom: 0
        }
      }
      return {
        bottom:
          layout.scrollX.value && props.data.length
            ? layout.gutterWidth + 'px'
            : ''
      }
    } else {
      if (props.showSummary) {
        return {
          height: layout.tableHeight.value
            ? layout.tableHeight.value + 'px'
            : ''
        }
      }
      return {
        height: layout.viewportHeight.value
          ? layout.viewportHeight.value + 'px'
          : ''
      }
    }
  })
  const fixedBodyHeight = computed(() => {
    if (props.height) {
      return {
        height: layout.fixedBodyHeight.value
          ? layout.fixedBodyHeight.value + 'px'
          : ''
      }
    } else if (props.maxHeight) {
      let maxHeight = parseHeight(props.maxHeight)
      if (typeof maxHeight === 'number') {
        maxHeight = layout.scrollX.value
          ? maxHeight - layout.gutterWidth
          : maxHeight
        if (props.showHeader) {
          maxHeight -= layout.headerHeight.value
        }
        maxHeight -= layout.footerHeight.value
        return {
          'max-height': maxHeight + 'px'
        }
      }
    }
    return {}
  })

  return {
    isHidden,
    renderExpanded,
    setDragVisible,
    isGroup,
    handleMouseLeave,
    handleHeaderFooterMousewheel,
    tableSize,
    bodyHeight,
    emptyBlockStyle,
    handleFixedMousewheel,
    fixedHeight,
    fixedBodyHeight,
    resizeProxyVisible,
    bodyWidth,
    resizeState,
    scrollPosition
  }
}

export default useStyle
