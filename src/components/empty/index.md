## 空状态组件

空状态时的占位提示。

### 基础用法

:::demo

```html
<template>
  <el-empty />
</template>
```

:::

### 自定义描述

:::demo

```html
<template>
  <el-empty description="这里是空的" />
</template>
```

:::

### 自定义图片

通过设置 `image` 属性传入图片 URL。

:::demo

```html
<template>
  <el-empty
    image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
  />
</template>
```

:::

### 图片尺寸

使用 `image-size` 属性控制图片大小。

:::demo

```html
<template>
  <el-empty :image-size="300" />
</template>
```

:::

:::

### 底部内容

使用默认插槽可在底部插入内容。

:::demo

```html
<template>
  <el-empty>
    <el-link type="primary" href="https://e3.shengxinjing.cn/" target="_blank">跳转到首页</el-link>
  </el-empty>
</template>
```

:::

### Empty 属性

| 属性 | 说明 | 类型  | 可选值 | 默认值 |
| - | - | - | - | - |
| image | 图片地址 | string | - | - |
| image-size | 图片大小（宽度）| number | - | - |
| description | 描述 | string | - | - |

### Empty 插槽

| 插槽名 | 描述说明 |
| - | - |
| default | 自定义底部内容 |
| image | 自定义图片 |
| description | 自定义描述 |
