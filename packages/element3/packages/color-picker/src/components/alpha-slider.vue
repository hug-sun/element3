<template>
  <div class="el-color-alpha-slider" :class="{ 'is-vertical': vertical }">
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
import { getCurrentInstance, onMounted, reactive, toRefs, watch } from 'vue'
import draggable from '../draggable'

export default {
  name: 'el-color-alpha-slider',

  props: {
    color: {
      required: true
    },
    vertical: Boolean
  },

  setup(props) {
    const state = reactive({
      thumbLeft: 0,
      thumbTop: 0,
      background: null
    })
    const instance = getCurrentInstance()

    watch(props.color, update)

    // watch(() => props.color.value, update)

    onMounted(() => {
      const { bar, thumb } = instance.refs

      const dragConfig = {
        drag: (event) => {
          handleDrag(event)
        },
        end: (event) => {
          handleDrag(event)
        }
      }

      draggable(bar, dragConfig)
      draggable(thumb, dragConfig)
      update()
    })
    function handleClick(event) {
      const thumb = instance.refs.thumb
      const target = event.target

      if (target !== thumb) {
        handleDrag(event)
      }
    }

    function handleDrag(event) {
      const rect = instance.proxy.$el.getBoundingClientRect()
      const { thumb } = instance.refs

      if (!props.vertical) {
        let left = event.clientX - rect.left
        left = Math.max(thumb.offsetWidth / 2, left)
        left = Math.min(left, rect.width - thumb.offsetWidth / 2)

        props.color.set(
          'alpha',
          Math.round(
            ((left - thumb.offsetWidth / 2) /
              (rect.width - thumb.offsetWidth)) *
              100
          )
        )
      } else {
        let top = event.clientY - rect.top
        top = Math.max(thumb.offsetHeight / 2, top)
        top = Math.min(top, rect.height - thumb.offsetHeight / 2)

        props.color.set(
          'alpha',
          Math.round(
            ((top - thumb.offsetHeight / 2) /
              (rect.height - thumb.offsetHeight)) *
              100
          )
        )
      }
    }

    function getThumbLeft() {
      if (props.vertical) return 0
      const el = instance.proxy.$el
      const alpha = props.color._alpha

      if (!el) return 0
      const thumb = instance.refs.thumb
      return Math.round(
        (alpha * (el.offsetWidth - thumb.offsetWidth / 2)) / 100
      )
    }

    function getThumbTop() {
      if (!props.vertical) return 0
      const el = instance.proxy.$el
      const alpha = props.color._alpha

      if (!el) return 0
      const thumb = instance.refs.thumb
      return Math.round(
        (alpha * (el.offsetHeight - thumb.offsetHeight / 2)) / 100
      )
    }

    function getBackground() {
      if (props.color && props.color.value) {
        const { r, g, b } = props.color.toRgb()
        return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
      }
      return null
    }

    function update() {
      state.thumbLeft = getThumbLeft()
      state.thumbTop = getThumbTop()
      state.background = getBackground()
    }

    return { ...toRefs(state), handleClick, update }
  }
}
</script>
