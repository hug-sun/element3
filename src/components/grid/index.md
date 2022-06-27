## Grid 栅格

基于 CSS Grid，响应式，远离 IE。

### 基础用法

:::demo

```html
<template>
  <el-grid :x-gap="12" :cols="4">
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
  </el-grid>
</template>

<style scoped>
.light-blue {
  height: 108px;
  background-color: #409eff;
}
.blue {
  height: 108px;
  background-color: #66b1ff;
}
</style>
```

:::

### 间隔

设定水平、垂直间隔。

:::demo

```html
<template>
  <el-grid :x-gap="12" :y-gap="12" :cols="4">
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item>
      <div class="blue" />
    </el-grid-item>
  </el-grid>
</template>

<style scoped>
.light-blue {
  height: 108px;
  background-color: #409eff;
}
.blue {
  height: 108px;
  background-color: #66b1ff;
}
</style>
```

:::

### 偏移

设定水平、垂直间隔。

:::demo

```html
<template>
  <el-grid :x-gap="12" :cols="4">
    <el-grid-item :offset="1">
      <div class="light-blue" />
    </el-grid-item>
    <el-grid-item :offset="1">
      <div class="blue" />
    </el-grid-item>
  </el-grid>
</template>

<style scoped>
.light-blue {
  height: 108px;
  background-color: #409eff;
}
.blue {
  height: 108px;
  background-color: #66b1ff;
}
</style>
```

:::

### Grid Attributes

| 参数  | 说明           | 类型             | 可选值 | 默认值 |
| ----- | -------------- | ---------------- | ------ | ------ |
| cols  | 显示栅格的数量 | string \| number | —      | 24     |
| x-gap | 横向间隔槽     | number \| string | —      | 0      |
| y-gap | 纵向间隔槽     | number \| string | —      | 0      |

### GridItem Attributes

| 参数   | 说明               | 类型             | 可选值 | 默认值 |
| ------ | ------------------ | ---------------- | ------ | ------ |
| offset | 栅格左侧的间隔格数 | string \| number | —      | 0      |
