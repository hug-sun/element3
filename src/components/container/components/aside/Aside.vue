<script setup lang="ts">
import { withDefaults } from 'vue'
interface AsideType {
  width?: string
}

withDefaults(defineProps<AsideType>(), {
  width: '300px',
})
</script>

<script lang="ts">
export default {
  name: 'ElAside',
}
</script>

<template>
  <aside class="el-aside" :style="{ width }">
    <slot />
  </aside>
</template>

<style lang="scss">
@import '../../../../theme/src/aside.scss';
</style>
