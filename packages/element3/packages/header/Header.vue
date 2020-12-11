<template>
  <header class="el-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'ElHeader',

  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
}
</script>
