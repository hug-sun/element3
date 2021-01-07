<template>
  <div class="el-card" :class="`is-${shadow}-shadow`">
    <div class="el-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ElCard',
  props
})
</script>
