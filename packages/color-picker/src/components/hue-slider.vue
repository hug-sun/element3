<template>
  <div
    class="el-color-hue-slider"
    :class="{ 'is-vertical': vertical }"
    ref="el"
  >
    <div class="el-color-hue-slider__bar" @click="handleClick" ref="bar"></div>
    <div
      class="el-color-hue-slider__thumb"
      :style="{
        left: thumbLeft + 'px',
        top: thumbTop + 'px'
      }"
      ref="thumb"
    ></div>
  </div>
</template>

<script>
import draggable from '../draggable'
import { toRefs, ref, reactive, watch, onMounted } from 'vue'

export default {
  name: 'el-color-hue-slider',

  props: {
    color: {
      required: true
    },

    vertical: Boolean
  },

  setup(props) {
    const { color, vertical } = toRefs(props)

    const el = ref(null)
    const thumb = ref(null)
    const bar = ref(null)

    const state = reactive({
      thumbLeft: 0,
      thumbTop: 0
    })

    const getThumbLeft = () => {
      if (vertical.value) return 0
      const hue = color.value.get('hue')

      if (!el.value) return 0
      return Math.round(
        (hue * (el.value.offsetWidth - thumb.value.offsetWidth / 2)) / 360
      )
    }

    const getThumbTop = () => {
      if (!vertical.value) return 0
      const hue = color.value.get('hue')

      if (!el.value) return 0
      return Math.round(
        (hue * (el.value.offsetHeight - thumb.value.offsetHeight / 2)) / 360
      )
    }

    const update = () => {
      state.thumbLeft = getThumbLeft()
      state.thumbTop = getThumbTop()
    }

    const handleDrag = (event) => {
      const rect = el.value.getBoundingClientRect()
      let hue

      if (!vertical.value) {
        let left = event.clientX - rect.left
        left = Math.min(left, rect.width - thumb.value.offsetWidth / 2)
        left = Math.max(thumb.value.offsetWidth / 2, left)

        hue = Math.round(
          ((left - thumb.value.offsetWidth / 2) /
            (rect.width - thumb.value.offsetWidth)) *
            360
        )
      } else {
        let top = event.clientY - rect.top
        top = Math.min(top, rect.height - thumb.value.offsetHeight / 2)
        top = Math.max(thumb.value.offsetHeight / 2, top)

        hue = Math.round(
          ((top - thumb.value.offsetHeight / 2) /
            (rect.height - thumb.value.offsetHeight)) *
            360
        )
      }

      color.value.set('hue', hue)
    }

    const handleClick = (event) => {
      const target = event.target

      if (target !== thumb.value) {
        handleDrag(event)
      }
    }

    watch(
      () => color.value.get('hue'),
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
      el,
      thumb,
      bar,
      vertical,

      handleClick
    }
  }
}
</script>
