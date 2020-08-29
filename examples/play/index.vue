<template>
  <el-button
          plain
          @click="open1">
    可自动关闭
  </el-button>
  <el-button
          plain
          @click="open2">
    不会自动关闭
  </el-button>
  <el-button
          plain
          @click="close">
    全部关闭
  </el-button>
</template>

<script>
  import {h} from 'vue'
  export default {
    methods: {
      open1() {

        this.$notify({
          title: '标题名称',
          message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
        });
      },

      open2() {
        this.$notify({
          title: '提示',
          message: '这是一条不会自动关闭的消息',
          duration: 0
        });
      },
      close(){
        this.$notify.closeAll();
      }
    }
  }
</script>
