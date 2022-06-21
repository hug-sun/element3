<script setup lang="ts">
import { withDefaults } from 'vue'
interface FooterType {
  height?: string
}

withDefaults(defineProps<FooterType>(), {
  height: '60px',
})
</script>

<script lang="ts">
export default {
  name: 'ElFooter',
}
</script>

<template>
  <footer class="el-footer" :style="{ height }">
    <slot />
  </footer>
</template>

<style lang="scss">
@import '../../../../theme/src/footer.scss';
</style>
