<template>
  <header class="el-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
import { toRefs } from 'vue'

export default {
  name: 'ElHeader',

  props: {
    height: {
      type: String,
      default: '60px'
    }
  },

  setup(props) {
    const { height } = toRefs(props)

    return { height }
  }
}
</script>
