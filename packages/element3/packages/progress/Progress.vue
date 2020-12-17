<template>
  <div class="el-progress el-progress--line">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer">
        <div class="el-progress-bar__inner" style="width: 55%"></div>
      </div>
    </div>
    <div class="el-progress__text">55%</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ElProgress',
  props: {},
  setup() {
    return {}
  }
})
</script>

<style></style>
