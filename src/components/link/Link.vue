<script setup lang="ts"></script>

<template>
  <a class="el-link">
    <span v-if="$slots.default" class="el-link--inner">
      <slot />
    </span>
  </a>
</template>

<style lang="scss">
@import "../../theme/src/link.scss";
</style>
