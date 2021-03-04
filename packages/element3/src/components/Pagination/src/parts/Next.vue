<template>
  <button type="button" class="btn-next" @click="pager.next()">
    <i class="el-icon el-icon-arrow-right"></i>
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
