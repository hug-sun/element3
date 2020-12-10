<template>
  <div class="el-card" :class="`is-${shadow}-shadow`">
    <div class="el-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElCard',
  props: {
    header: {
      type: String,
      default: ''
    },
    bodyStyle: {
      type: Object,
      default: function () {
        return {
          padding: '20px'
        }
      }
    },
    shadow: {
      type: String,
      default: 'always'
    }
  }
}
</script>
