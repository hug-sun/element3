# Avatar 头像

Avatar 组件可以表示人物或对象的基本信息，支持使用图标、文字和图片作为内容。

## 基础用法
使用`shape`、`size` 来设置 Avatar 的形状和大小
:::demo 
```html
<template>
  <el-row>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
    <!-- 默认 medium -->
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="medium"></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="large"></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="50"></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" shape="circle"></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" shape="square"></el-avatar>
  </el-row>
</template>
```
:::

## 展示类型
支持使用图片，图标或者文字作为 Avatar
:::demo 
```html
<template>
  <el-row>
    <el-avatar>user</el-avatar>
    <el-avatar icon="el-icon-user" ></el-avatar>
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
  </el-row>
</template>
```
:::


## 回退行为
当图片加载失败时，默认回退至默认图标。
:::demo 
```html
<template>
  <el-avatar size="60" src="https://empty">
  </el-avatar>
</template>
```
:::

## 适应容器
当使用图片作为用户头像时，可设置该图片如何在容器中展示。与 CSS 属性 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 值一致
:::demo 
```html
<template>
  <el-row>
    <el-avatar fit="contain" size="100" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" ></el-avatar>
    <el-avatar fit="fill" size="100" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" ></el-avatar>
    <el-avatar fit="cover" size="100" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" ></el-avatar>
    <el-avatar fit="none" size="100" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" ></el-avatar>
    <el-avatar fit="scale-down" size="100" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" ></el-avatar>
  </el-row>
</template>
```
:::


## Avatar Properties
| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `alt` | 设置描述图片的替换文本 | `string` |  | - |
| `icon` | 设置头像显示的图标 | `string` |  | `el-icon-user` |
| `fit` | 让图片适应容器框 | `string` | `fill` \| `contain` \| `cover` \| `none` \| `scale-down` | `contain` |
| `size` | 设置头像大小 | `string` \| `number` | `large` \| `medium` \| `small` | `medium` |
| `shape` | 设置头像形状 | `string` | `circle` \| `square` | `circle` |
| `src` | 设置头像图片地址 | `string` |  | - |
| `srcset` | 设置一个或多个图像候选地址 | `string` |  | - |