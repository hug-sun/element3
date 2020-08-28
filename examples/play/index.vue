<template>
  <div class="wrapper" style="height:1400px">
  <el-backtop target=".wrapper" :bottom="100">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      UP
    </div>
  </el-backtop>
  </div>
  <el-checkbox-group
    v-model="checkList"
    @change="onChange"
  >
    <el-checkbox
      v-for="(item, index) in ['A','B','C']" :key="index"
      :label="item"
      :checked="true"
    ></el-checkbox>
  </el-checkbox-group>
  <el-checkbox-group v-model="checkList" @change="onChange">
    <el-checkbox label="A" :checked="true"></el-checkbox>
    <el-checkbox label="B" :checked="true"></el-checkbox>
    <el-checkbox label="C"></el-checkbox>
  </el-checkbox-group>
  <view>
    <el-checkbox
      v-model="checked1"
      label="1"
      checked
    >备选项1</el-checkbox>
    <el-checkbox
      v-model="checked1"
      label="2"
    >备选项2</el-checkbox>
  </view>
  <br>
  <view>
    <el-checkbox v-model="checked2" @change="onChange">备选项1</el-checkbox>
  </view>
  <br>
  <view>
    <el-checkbox-group
      v-model="checked3"
      :min="1"
      :max="2"
      text-color="red"
      fill="blue"
    >
      <el-checkbox-button label="A"></el-checkbox-button>
      <el-checkbox-button label="B"></el-checkbox-button>
      <el-checkbox-button label="C"></el-checkbox-button>
    </el-checkbox-group>
  </view>
  <br>
  <view>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        v-for="city in cities"
        :label="city"
        :key="city"
      >{{city}}</el-checkbox>
    </el-checkbox-group>
  </view>
</template>

<script>
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  data() {
    return {
      checkList: [],
      checked1: [],
      checked2: true,
      checked3: [],
      disabled: true,
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: true,
    };
  },
  watch: {
    checkList: {
      handler: (v) => {
        console.log("watch:checkList :>> ", v);
      },
      deep: true,
    },
    checked1: {
      handler: (v) => {
        console.log("watch:checked1 :>> ", v);
      },
      deep: true,
    },
    checked3: {
      handler: (v) => {
        console.log("watch:checked3 :>> ", v);
      },
      deep: true,
    },
    checked2: {
      handler: (v) => {
        console.log("watch:checked2 :>> ", v);
      },
    },
  },
  methods: {
    onChange(v) {
      console.log("change:", v);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? [...cityOptions] : [];

      this.isIndeterminate = false;
      console.log("val :>> ", val, this.checkedCities);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
};
</script>
