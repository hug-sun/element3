<template>
  <div
    class="el-color-svpanel"
    ref="el"
    :style="{
      backgroundColor: background
    }"
  >
    <div class="el-color-svpanel__white"></div>
    <div class="el-color-svpanel__black"></div>
    <div
      class="el-color-svpanel__cursor"
      :style="{
        top: cursorTop + 'px',
        left: cursorLeft + 'px'
      }"
    >
      <div></div>
    </div>
  </div>
</template>

<script>
import draggable from '../draggable'
import { toRefs, reactive, ref, onMounted, watch } from 'vue'

export default {
  name: 'el-sl-panel',

  props: {
    color: {
      required: true
    }
  },

  setup(props) {
    const { color } = toRefs(props)

    const el = ref(null)

    const state = reactive({
      cursorTop: 0,
      cursorLeft: 0,
      background: 'hsl(0, 100%, 50%)'
    })

    const update = () => {
      const saturation = color.value.get('saturation')
      const value = color.value.get('value')

      const { clientWidth: width, clientHeight: height } = el.value

      state.cursorLeft = (saturation * width) / 100
      state.cursorTop = ((100 - value) * height) / 100

      state.background = 'hsl(' + color.value.get('hue') + ', 100%, 50%)'
    }

    const handleDrag = (event) => {
      const rect = el.value.getBoundingClientRect()

      let left = event.clientX - rect.left
      let top = event.clientY - rect.top
      left = Math.max(0, left)
      left = Math.min(left, rect.width)

      top = Math.max(0, top)
      top = Math.min(top, rect.height)

      state.cursorLeft = left
      state.cursorTop = top
      color.value.set({
        saturation: (left / rect.width) * 100,
        value: 100 - (top / rect.height) * 100
      })
    }

    onMounted(() => {
      draggable(el.value, {
        drag: (event) => {
          handleDrag(event)
        },
        end: (event) => {
          handleDrag(event)
        }
      })

      update()
    })

    watch(
      () => {
        const hue = color.value.get('hue')
        const value = color.value.get('value')
        return { hue, value }
      },
      () => {
        update()
      }
    )

    return {
      ...toRefs(state),
      el
    }
  }
}
</script>
