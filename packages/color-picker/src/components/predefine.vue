<template>
  <div class="el-color-predefine">
    <div class="el-color-predefine__colors">
      <div
        class="el-color-predefine__color-selector"
        :class="{ selected: item.selected, 'is-alpha': item._alpha < 100 }"
        v-for="(item, index) in rgbaColors"
        :key="colors[index]"
        @click="handleSelect(index)"
      >
        <div :style="{ 'background-color': item.value }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Color from '../color'
import { reactive, toRefs, watch } from 'vue'

export default {
  props: {
    currentColor: String,
    colors: { type: Array, required: true },
    color: { required: true }
  },
  setup(props) {
    const { color, colors, currentColor } = toRefs(props)

    const parseColors = (colors, color) => {
      return colors.map((value) => {
        const c = new Color()
        c.enableAlpha = true
        c.format = 'rgba'
        c.fromString(value)
        c.selected = c.value === color.value
        return c
      })
    }

    const state = reactive({
      rgbaColors: parseColors(colors.value, color.value)
    })

    const handleSelect = (index) => {
      color.value.fromString(colors.value[index])
    }

    watch(
      () => currentColor.value,
      (val) => {
        const color = new Color()
        color.fromString(val)

        state.rgbaColors.forEach((item) => {
          item.selected = color.compare(item)
        })
      }
    )

    watch(
      () => colors,
      (newVal) => {
        state.rgbaColors = parseColors(newVal, color.value)
      }
    )

    watch(
      () => color,
      (newVal) => {
        state.rgbaColors = parseColors(colors.value, newVal)
      }
    )

    return {
      ...toRefs(state),
      colors,
      handleSelect
    }
  }
}
</script>
