<template>
  <div style="width: 500px">
    <el-tabs v-model="activeName" tab-position="left" style="height: 500px">
      <el-tab-pane name="1" lazy closable>
        <template v-slot:label>
          <span><i class="el-icon-date"></i> 我的行程</span>
        </template>
        我的行程
      </el-tab-pane>
      <el-tab-pane name="2" lazy label="消息中心">消息中心</el-tab-pane>
      <el-tab-pane name="3" label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane name="4" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="5" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="6" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="7" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="8" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="9" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="10" label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-tab-pane name="11" label="定时任务补偿1">定时任务补偿1</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: '1',
      };
    },
    watch:{
      activeName(v){
        console.log('activeName :>> ', v);
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      edit(name, action){
        console.log(name)
        console.log(action)
      },
      async beforeLeave(){
        console.log(arguments)
        throw "e"
      }
    },
    mounted(){
      setTimeout(() => {
        this.activeName = '3'
      }, 3000);
    }
  };
</script>