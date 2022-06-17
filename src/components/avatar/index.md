## Avatar 头像

Avatar 组件可以表示人物或对象的基本信息，支持使用图标、文字和图片作为内容。

### 基础用法

:::demo 使用`shape`、`size` 来设置 Avatar 的形状和大小
```vue
<template>
  <el-row>
    <el-avatar></el-avatar>
    <!-- 默认 medium -->
    <el-avatar size="small"></el-avatar>
    <el-avatar size="medium"></el-avatar>
    <el-avatar size="large"></el-avatar>
    <el-avatar size="50"></el-avatar>
    <el-avatar shape="circle"></el-avatar>
    <el-avatar shape="square"></el-avatar>
  </el-row>
</template>
```
:::

### 展示类型
:::demo
:::


### 回退行为
:::demo
:::

### 适应容器
:::demo
```vue
<template>
  <el-row>
    <el-avatar fit="fill"></el-avatar>
    <el-avatar fit="contain"></el-avatar>
    <el-avatar fit="cover"></el-avatar>
    <el-avatar fit="none"></el-avatar>
    <el-avatar fit="scale-down"></el-avatar>
  </el-row>
</template>
```
:::