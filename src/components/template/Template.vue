<script setup lang="ts">
import { withDefaults } from 'vue'
interface DividerType {
  num?: number
}

withDefaults(defineProps<DividerType>(), {
  num: 1,
})
</script>

<template>
  <div v-bind="$attrs" class="el-demo">
    组件模板 {{ num }}
  </div>
</template>

<style lang="scss">
// @import '../../theme/src/divider.scss'
</style>
