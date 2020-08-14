<template>
  <div style="margin: 20px;">
    <el-radio v-model="radio" label="1" @change="onSelect"></el-radio>
    <el-radio v-model="radio" label="2" @change="onSelect"></el-radio>
    
    <br>
    <br>
    <el-radio-group v-model="radio1" @change="onSelect"  text-color="red" fill="blue">
      <el-radio-button label="1"></el-radio-button>
      <el-radio-button label="2"></el-radio-button>
    </el-radio-group>
    <br>
    <br>
    <el-radio-group v-model="radio2" @change="onSelect">
      <el-radio label="1"></el-radio>
      <el-radio label="2"></el-radio>
      <el-radio label="3"></el-radio>
    </el-radio-group>
    <br>
    <br>
    <el-radio-group v-model="radio3" @change="onSelect">
      <el-radio label="1"></el-radio>
      <el-radio label="2"></el-radio>
      <el-radio label="3"></el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio:'1',
        radio1: '2',
        radio2: '1',
        radio3: '1',
      };
    },
    methods: {
      onSelect(v){
        console.log(v);
      }
    },
  };
</script>
