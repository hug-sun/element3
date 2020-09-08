// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js
import { nextTick, reactive, ref, toRefs, onMounted, onUnmounted } from 'vue'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width'
import { toObject } from 'element-ui/src/utils/util'
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
    if (!wrap) return

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

  setup(props, { slots }) {
    const wrap = ref(null)
    const resize = ref(null)
    let {
      wrapStyle,
      wrapClass,
      tag,
      viewClass,
      viewStyle,
      native,
      noresize
    } = toRefs(props)
    wrapStyle = ref(wrapStyle)
    wrapClass = ref(wrapClass)
    viewClass = ref(viewClass)
    viewStyle = ref(viewStyle)
    const gutter = scrollbarWidth()
    let style = wrapStyle.value
    // eslint-disable-next-line no-unused-vars
    const ComponentName = tag.value
    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

      if (Array.isArray(wrapStyle.value)) {
        style = toObject(wrapStyle.value)
        style.marginRight = style.marginBottom = gutterWith
      } else if (typeof wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }

    const { data, handleScroll } = useScroll(wrap, native, resize, noresize)
    return () => (
      <div class="el-scrollbar">
        <div
          ref={wrap}
          class={[
            wrapClass.value,
            'el-scrollbar__wrap',
            { 'el-scrollbar__wrap--hidden-default': !native.value && !gutter }
          ]}
          onScroll={() => {
            !native.value && handleScroll()
          }}
          style={style}
        >
          <ComponentName
            ref={resize}
            class={['el-scrollbar__view', viewClass.value]}
            style={viewStyle.value}
          >
            {slots.default()}
          </ComponentName>
        </div>
        {!native.value && [
          <Bar move={data.moveX} size={data.sizeWidth} />,
          <Bar vertical move={data.moveY} size={data.sizeHeight} />
        ]}
      </div>
    )
  }
}
