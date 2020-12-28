import { on, off } from '../../src/utils/dom'
import { renderThumbStyle, BAR_MAP } from './util'
import {
  ref,
  reactive,
  computed,
  toRefs,
  getCurrentInstance,
  onUnmounted
} from 'vue'

const useDrag = ({ bar, state, thumb, cursorDown }) => {
  const instance = getCurrentInstance()
  const { proxy } = instance
  const wrap = computed(() => instance.parent.proxy.wrap)
  const startDrag = (e) => {
    e.stopImmediatePropagation()
    cursorDown.value = true

    on(document, 'mousemove', mouseMoveDocumentHandler)
    on(document, 'mouseup', mouseUpDocumentHandler)
    document.onselectstart = () => false
  }

  const mouseMoveDocumentHandler = (e) => {
    if (cursorDown.value === false) return
    const prevPage = state[bar.value.axis]

    if (!prevPage) return

    const offset =
      (proxy.$el.getBoundingClientRect()[bar.value.direction] -
        e[bar.value.client]) *
      -1
    const thumbClickPosition = thumb.value[bar.value.offset] - prevPage
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100) / proxy.$el[bar.value.offset]

    wrap.value[bar.value.scroll] =
      (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
  }

  const mouseUpDocumentHandler = () => {
    cursorDown.value = false
    state[bar.value.axis] = 0
    off(document, 'mousemove', mouseMoveDocumentHandler)
    document.onselectstart = null
  }

  const clickThumbHandler = (e) => {
    // prevent click event of right button
    if (e.ctrlKey || e.button === 2) {
      return
    }
    startDrag(e)
    state[bar.value.axis] =
      e.currentTarget[bar.value.offset] -
      (e[bar.value.client] -
        e.currentTarget.getBoundingClientRect()[bar.value.direction])
  }

  const clickTrackHandler = (e) => {
    const offset = Math.abs(
      e.target.getBoundingClientRect()[bar.value.direction] -
        e[bar.value.client]
    )
    const thumbHalf = thumb.value[bar.value.offset] / 2
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100) / proxy.$el[bar.value.offset]

    wrap.value[bar.value.scroll] =
      (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
  }

  onUnmounted(() => {
    off(document, 'mouseup', mouseUpDocumentHandler)
  })

  return {
    clickThumbHandler,
    clickTrackHandler
  }
}

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  setup(props) {
    const { size, move, vertical } = toRefs(props)
    const bar = computed(
      () => BAR_MAP[vertical.value ? 'vertical' : 'horizontal']
    )
    const state = reactive({})
    const cursorDown = ref(false)
    const thumb = ref(null)
    const { clickThumbHandler, clickTrackHandler } = useDrag({
      bar,
      state,
      thumb,
      cursorDown
    })
    return () => (
      <div
        class={['el-scrollbar__bar', 'is-' + bar.value.key]}
        onMouseDown={clickTrackHandler}
      >
        <div
          ref={thumb}
          className="el-scrollbar__thumb"
          onMouseDown={clickThumbHandler}
          style={renderThumbStyle({ size, move, bar })}
        ></div>
      </div>
    )
  }
}
