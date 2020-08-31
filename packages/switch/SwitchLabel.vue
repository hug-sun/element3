<template>
  <span
    v-if="iconClass || text"
    :class="{
      'el-switch__label': true,
      'is-active': active,
      [`el-switch__label--${type}`]: true
    }"
  >
    <i :class="[iconClass]"></i>

    <span v-if="!iconClass">{{ text }}</span>
  </span>
</template>

<script>
import { toRefs } from 'vue'
export default {
  props: {
    type: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { type, active, text, iconClass } = toRefs(props)
    return { type, text, active, iconClass }
  }
}
</script>

<style></style>
