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
  }
}
</script>

<style></style>
