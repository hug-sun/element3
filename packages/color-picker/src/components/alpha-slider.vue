<template>
  <div
    class="el-color-alpha-slider"
    :class="{ 'is-vertical': vertical }"
    ref="el"
  >
    <div
      class="el-color-alpha-slider__bar"
      @click="handleClick"
      ref="bar"
      :style="{
        background: background
      }"
    ></div>
    <div
      class="el-color-alpha-slider__thumb"
      ref="thumb"
      :style="{
        left: thumbLeft + 'px',
        top: thumbTop + 'px'
      }"
    ></div>
  </div>
</template>

<script>
import draggable from '../draggable'
import { watch, toRefs, ref, reactive, onMounted } from 'vue'

export default {
  name: 'el-color-alpha-slider',

  props: {
    color: {
      required: true
    },
    vertical: Boolean
  },

  setup(props) {
    const { color, vertical } = toRefs(props)

    const state = reactive({
      thumbLeft: 0,
      thumbTop: 0,
      background: null
    })

    const el = ref(null)
    const bar = ref(null)
    const thumb = ref(null)

    const handleDrag = (event) => {
      const rect = el.value.getBoundingClientRect()

      if (!vertical.value) {
        let left = event.clientX - rect.left
        left = Math.max(thumb.value.offsetWidth / 2, left)
        left = Math.min(left, rect.width - thumb.value.offsetWidth / 2)

        color.value.set(
          'alpha',
          Math.round(
            ((left - thumb.value.offsetWidth / 2) /
              (rect.width - thumb.value.offsetWidth)) *
              100
          )
        )
      } else {
        let top = event.clientY - rect.top
        top = Math.max(thumb.value.offsetHeight / 2, top)
        top = Math.min(top, rect.height - thumb.value.offsetHeight / 2)

        color.value.set(
          'alpha',
          Math.round(
            ((top - thumb.value.offsetHeight / 2) /
              (rect.height - thumb.value.offsetHeight)) *
              100
          )
        )
      }
    }

    const handleClick = (event) => {
      const target = event.target

      if (target !== thumb.value) {
        handleDrag(event)
      }
    }

    const getThumbLeft = () => {
      if (vertical.value) return 0
      const alpha = color.value._alpha

      if (!el.value) return 0
      return Math.round(
        (alpha * (el.value.offsetWidth - thumb.value.offsetWidth / 2)) / 100
      )
    }

    const getThumbTop = () => {
      if (!vertical.value) return 0
      const alpha = color.value._alpha

      if (!el.value) return 0
      return Math.round(
        (alpha * (el.value.offsetHeight - thumb.value.offsetHeight / 2)) / 100
      )
    }

    const getBackground = () => {
      if (color.value && color.value.value) {
        const { r, g, b } = color.value.toRgb()
        return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
      }
      return null
    }

    const update = () => {
      state.thumbLeft = getThumbLeft()
      state.thumbTop = getThumbTop()
      state.background = getBackground()
    }

    watch(
      () => color.value._alpha,
      () => {
        update()
      }
    )

    watch(
      () => color.value.value,
      () => {
        update()
      }
    )

    onMounted(() => {
      const dragConfig = {
        drag: (event) => {
          handleDrag(event)
        },
        end: (event) => {
          handleDrag(event)
        }
      }

      draggable(bar.value, dragConfig)
      draggable(thumb.value, dragConfig)
      update()
    })

    return {
      ...toRefs(state),
      vertical,
      el,
      bar,
      thumb,

      handleClick
    }
  }
}
</script>
