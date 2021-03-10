<template>
  <button type="button" class="btn-prev" @click="pager.prev()">
    <i class="el-icon el-icon-arrow-left"></i>
    <span v-if="pager.style.prevText" v-text="pager.style.prevText"></span>
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
