// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js
import { nextTick, reactive, ref, toRefs, onMounted, onUnmounted } from 'vue'
import {
  addResizeListener,
  removeResizeListener
} from '../../src/utils/resize-event'
import scrollbarWidth from '../../src/utils/scrollbar-width'
import { toObject } from '../../src/utils/util'
import Bar from './Bar'

const useScroll = (wrap, native, resize, noresize) => {
  const data = reactive({
    sizeWidth: '0',
    sizeHeight: '0',
    moveX: 0,
    moveY: 0
  })

  const handleScroll = () => {
    data.moveY = (wrap.value.scrollTop * 100) / wrap.value.clientHeight
    data.moveX = (wrap.value.scrollLeft * 100) / wrap.value.clientWidth
  }

  const update = () => {
    if (!wrap?.value) return

    const heightPercentage =
      (wrap.value.clientHeight * 100) / wrap.value.scrollHeight
    const widthPercentage =
      (wrap.value.clientWidth * 100) / wrap.value.scrollWidth

    data.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
    data.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
  }

  onMounted(() => {
    if (native.value) return
    nextTick(update)
    !noresize.value && addResizeListener(resize.value, update)
  })
  onUnmounted(() => {
    if (native.value) return
    !noresize.value && removeResizeListener(resize.value, update)
  })

  return {
    data,
    update,
    handleScroll
  }
}

/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  setup(props) {
    const wrap = ref(null)
    const resize = ref(null)
    const { wrapStyle, tag, native, noresize } = toRefs(props)
    const gutter = scrollbarWidth()
    let style = wrapStyle?.value
    const ComponentName = tag.value
    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

      if (Array.isArray(wrapStyle?.value)) {
        style = toObject(wrapStyle?.value)
        style.marginRight = style.marginBottom = gutterWith
      } else if (typeof wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }

    const { data, handleScroll, update } = useScroll(
      wrap,
      native,
      resize,
      noresize
    )
    return {
      // state
      data,
      style,
      native,
      gutter,
      wrap,
      resize,
      ComponentName,
      // methods
      handleScroll,
      update
    }
  },
  render() {
    const ComponentName = this.ComponentName
    return (
      <div class="el-scrollbar">
        <div
          ref="wrap"
          class={[
            this.wrapClass,
            'el-scrollbar__wrap',
            {
              'el-scrollbar__wrap--hidden-default': !this.native && !this.gutter
            }
          ]}
          onScroll={() => {
            !this.native && this.handleScroll()
          }}
          style={this.style}
        >
          <ComponentName
            ref="resize"
            class={['el-scrollbar__view', this.viewClass]}
            style={this.viewStyle}
          >
            {this.$slots.default()}
          </ComponentName>
        </div>
        {!this.native.value && [
          <Bar move={this.data.moveX} size={this.data.sizeWidth} />,
          <Bar vertical move={this.data.moveY} size={this.data.sizeHeight} />
        ]}
      </div>
    )
  }
}
