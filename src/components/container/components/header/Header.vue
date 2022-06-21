<script setup lang="ts">
import { withDefaults } from 'vue'
interface HeaderType {
  height?: string
}

withDefaults(defineProps<HeaderType>(), {
  height: '60px',
})
</script>

<script lang="ts">
export default {
  name: 'ElHeader',
}
</script>

<template>
  <header class="el-header" :style="{ height }">
    <slot />
  </header>
</template>

<style lang="scss">
@import '../../../../theme/src/header.scss';
</style>
