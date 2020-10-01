<template>
  <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs> -->
  <el-checkbox-group v-model="value" @change="change">
    <el-checkbox label="1">1</el-checkbox>
    <el-checkbox label="2">2</el-checkbox>
  </el-checkbox-group>

</template>
<script>
  export default {
    data() {
      return {
        activeName: 'second',
        value: false
      };
    },
    watch:{
      value:{
        handler(v){
          console.log('watch v :>> ', v);
        },
        deep:true
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      change(v){
        console.log('change v :>> ', v);
      }
    }
  };
</script>