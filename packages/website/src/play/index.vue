<template>
  <el-menu unique-opened>
    <el-submenu index="2">
      <template v-slot:title>我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template v-slot:title>我的工作台</template>
      <el-menu-item index="5-1">选项1</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    let activeIndex = ref('1')
    let activeIndex2 = ref('1')

    function handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }

    return { activeIndex, activeIndex2, handleSelect }
  }
}
</script>
