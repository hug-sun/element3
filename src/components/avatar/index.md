## Avatar 头像

Avatar 组件可以表示人物或对象的基本信息，支持使用图标、文字和图片作为内容。

### 基础用法
使用`shape`、`size` 来设置 Avatar 的形状和大小
:::demo 
```html
<template>
  <el-row>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png"></el-avatar>
    <!-- 默认 medium -->
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" size="small"></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" size="medium"></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" size="large"></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" size="50"></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" shape="circle"></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" shape="square"></el-avatar>
  </el-row>
</template>
```
:::

### 展示类型
支持使用图片，图标或者文字作为 Avatar
:::demo 
```html
<template>
  <el-row>
    <el-avatar>user</el-avatar>
    <el-avatar icon="user-solid" ></el-avatar>
    <el-avatar src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png"></el-avatar>
  </el-row>
</template>
```
:::


### 回退行为
当图片加载失败时，可设置回退行为。
:::demo 
```html
<template>
  <el-avatar :size="60" src="https://empty" @error="errorHandler">
    <el-icon name="error" />
  </el-avatar>
</template>

<script lang="ts" setup>
const errorHandler = () => {
  return true
}
</script>
```
:::

### 适应容器
当使用图片作为用户头像时，可设置该图片如何在容器中展示。与 CSS 属性 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 值一致
:::demo 
```html
<template>
  <el-row>
    <el-avatar size="50" shape="square" src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" fit="fill"></el-avatar>
    <el-avatar size="50" shape="square" src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" fit="contain"></el-avatar>
    <el-avatar size="50" shape="square" src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" fit="cover"></el-avatar>
    <el-avatar size="50" shape="square" src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" fit="none"></el-avatar>
    <el-avatar size="50" shape="square" src="https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png" fit="scale-down"></el-avatar>
  </el-row>
</template>
```
:::