<template>
  <div
    class="el-card"
    :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'"
  >
    <div class="el-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue'

export default {
  name: 'ElCard',
  componentName: 'ElCard',
  props: {
    header: {
      type: String
    },
    bodyStyle: {
      type: Object
    },
    shadow: {
      type: String,
      default: 'always'
    }
  },
  setUp(props, { slots }) {
    const { header, bodyStyle, shadow } = toRefs(props)

    return {
      header,
      shadow,
      bodyStyle
    }
  }
}
</script>
