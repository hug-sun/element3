<template>
  <div class="el-color-hue-slider" :class="{ 'is-vertical': vertical }">
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
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  watch
} from 'vue'
import draggable from '../draggable'

export default {
  name: 'el-color-hue-slider',

  props: {
    color: {
      required: true
    },

    vertical: Boolean
  },
  setup(props) {
    const instance = getCurrentInstance()

    const state = reactive({
      thumbLeft: 0,
      thumbTop: 0
    })

    const hueValue = computed(() => {
      return props.color.get('hue')
    })

    watch(hueValue, update)

    function handleClick(event) {
      const { thumb } = state
      const target = event.target
      if (target !== thumb) {
        handleDrag(event)
      }
    }

    function handleDrag(event) {
      const rect = instance.proxy.$el.getBoundingClientRect()
      const { thumb } = instance.refs
      let hue

      if (!props.vertical) {
        let left = event.clientX - rect.left
        left = Math.min(left, rect.width - thumb.offsetWidth / 2)
        left = Math.max(thumb.offsetWidth / 2, left)

        hue = Math.round(
          ((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth)) *
            360
        )
      } else {
        let top = event.clientY - rect.top
        top = Math.min(top, rect.height - thumb.offsetHeight / 2)
        top = Math.max(thumb.offsetHeight / 2, top)

        hue = Math.round(
          ((top - thumb.offsetHeight / 2) /
            (rect.height - thumb.offsetHeight)) *
            360
        )
      }

      props.color.set('hue', hue)
    }

    function getThumbLeft() {
      if (props.vertical) return 0
      const el = instance.proxy.$el
      const hue = props.color.get('hue')

      if (!el) return 0
      const thumb = instance.refs.thumb
      return Math.round((hue * (el.offsetWidth - thumb.offsetWidth / 2)) / 360)
    }

    function getThumbTop() {
      if (!props.vertical) return 0
      const el = instance.proxy.$el
      const hue = props.color.get('hue')

      if (!el) return 0
      const thumb = instance.refs.thumb
      return Math.round(
        (hue * (el.offsetHeight - thumb.offsetHeight / 2)) / 360
      )
    }
    function update() {
      state.thumbLeft = getThumbLeft()
      state.thumbTop = getThumbTop()
    }

    onMounted(() => {
      const { bar, thumb } = instance.refs
      const dragConfig = {
        drag: (event) => handleDrag(event),
        end: (event) => handleDrag(event)
      }

      draggable(bar, dragConfig)
      draggable(thumb, dragConfig)
      update()
    })
    return { ...toRefs(state), handleClick, update }
  }
}
</script>
