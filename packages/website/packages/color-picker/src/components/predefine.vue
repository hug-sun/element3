<!--
 * @Author: Mr Chang
 * @Date: 2020-09-02 10:30:20
 * @LastEditTime: 2020-09-18 15:12:00
 * @LastEditors: Mr Chang
 * @Description: 
 * @FilePath: \element3\packages\color-picker\src\components\predefine.vue
-->
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
import { inject, reactive, toRefs, watch } from 'vue'
import Color from '../color'

export default {
  props: {
    colors: { type: Array, required: true },
    color: { required: true }
  },
  setup(props) {
    const state = reactive({
      rgbaColors: parseColors(props.colors, props.color)
    })

    const currentColor = inject('currentColor')
    watch(currentColor, (val) => {
      const color = new Color()
      color.fromString(val)

      state.rgbaColors.forEach((item) => {
        item.selected = color.compare(item)
      })
    })

    watch(props.colors, (newVal) => {
      state.rgbaColors = parseColors(newVal, props.color)
    })

    watch(props.color, (newVal) => {
      state.rgbaColors = parseColors(props.colors, newVal)
    })
    function handleSelect(index) {
      props.color.fromString(props.colors[index])
    }

    function parseColors(colors, color) {
      return colors.map((value) => {
        const c = new Color()
        c.enableAlpha = true
        c.format = 'rgba'
        c.fromString(value)
        c.selected = c.value === color.value
        return c
      })
    }
    return { ...toRefs(state), handleSelect }
  }
}
</script>
