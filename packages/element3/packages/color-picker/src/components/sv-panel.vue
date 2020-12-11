<template>
  <div
    class="el-color-svpanel"
    ref="panel"
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
  name: 'el-sl-panel',

  props: {
    color: {
      required: true
    }
  },

  setup(props) {
    const state = reactive({
      cursorTop: 0,
      cursorLeft: 0,
      background: 'hsl(0, 100%, 50%)'
    })

    const instance = getCurrentInstance()

    const colorValue = computed(() => {
      const hue = props.color.get('hue')
      const value = props.color.get('value')
      return { hue, value }
    })

    watch(colorValue, update)

    onMounted(() => {
      draggable(instance.refs.panel, {
        drag: handleDrag,
        end: handleDrag
      })
      update()
    })
    function update() {
      const saturation = props.color.get('saturation')
      const value = props.color.get('value')

      const el = instance.refs.panel
      const { clientWidth: width, clientHeight: height } = el

      state.cursorLeft = (saturation * width) / 100
      state.cursorTop = ((100 - value) * height) / 100

      state.background = 'hsl(' + props.color.get('hue') + ', 100%, 50%)'
    }

    function handleDrag(event) {
      const el = instance.refs.panel
      const rect = el.getBoundingClientRect()

      let left = event.clientX - rect.left
      let top = event.clientY - rect.top
      left = Math.max(0, left)
      left = Math.min(left, rect.width)

      top = Math.max(0, top)
      top = Math.min(top, rect.height)

      state.cursorLeft = left
      state.cursorTop = top
      props.color.set({
        saturation: (left / rect.width) * 100,
        value: 100 - (top / rect.height) * 100
      })
    }
    return { ...toRefs(state), handleDrag, update }
  }
}
</script>
