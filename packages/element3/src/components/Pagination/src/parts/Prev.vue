<template>
  <button type="button" class="btn-prev" @click="pager.prev()">
    <i class="el-icon el-icon-arrow-left"></i>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Pager } from '../entity/Pager'

export default defineComponent({
  props: {
    pager: Pager
  }
})
</script>
