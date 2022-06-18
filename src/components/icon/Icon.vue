<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <i :class="`el-icon-${name}`" />
</template>

<style lang="scss">
</style>
