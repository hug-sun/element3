## Alert 警告

用于页面中展示重要的提示信息。

### 基本用法

页面中的非浮层元素，不会自动消失。

:::demo

```vue
<template>
  <el-alert title="成功提示的文案" type="success"> </el-alert>
  <el-alert title="消息提示的文案" type="info"> </el-alert>
  <el-alert title="警告提示的文案" type="warning"> </el-alert>
  <el-alert title="错误提示的文案" type="error"> </el-alert>
</template>
```

:::

### 主题

Alert 组件提供了两个不同的主题：light 和 dark。

:::demo

```html
<template>
  <el-alert title="成功提示的文案" type="success" effect="dark"> </el-alert>
  <el-alert title="消息提示的文案" type="info" effect="dark"> </el-alert>
  <el-alert title="警告提示的文案" type="warning" effect="dark"> </el-alert>
  <el-alert title="错误提示的文案" type="error" effect="dark"> </el-alert>
</template>
```

:::

### 自定义关闭按钮

自定义关闭按钮为文字或其他符号。
:::demo

```html
<template>
  <el-alert title="不可关闭的 alert" type="success" :closable="false">
  </el-alert>
  <el-alert title="自定义 close-text" type="info" close-text="知道了">
  </el-alert>
  <el-alert title="设置了回调的 alert" type="warning" @close="hello">
  </el-alert>
</template>

<script>
  export default {
    setup() {
      function hello() {
        alert('Hello World!')
      }
      return { hello }
    },
  }
</script>
```

:::

### 带有 icon

表示某种状态时提升可读性。

:::demo

```html
<template>
  <el-alert title="成功提示的文案" type="success" show-icon> </el-alert>
  <el-alert title="消息提示的文案" type="info" show-icon> </el-alert>
  <el-alert title="警告提示的文案" type="warning" show-icon> </el-alert>
  <el-alert title="错误提示的文案" type="error" show-icon> </el-alert>
</template>
```

:::

### 文字居中

使用 center 属性让文字水平居中。

:::demo

```html
<template>
  <el-alert title="成功提示的文案" type="success" center show-icon> </el-alert>
  <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
  <el-alert title="警告提示的文案" type="warning" center show-icon> </el-alert>
  <el-alert title="错误提示的文案" type="error" center show-icon> </el-alert>
</template>
```

:::

### 带有辅助性文字介绍

包含标题和内容，解释更详细的警告。

:::demo

```html
<template>
  <el-alert
    title="带辅助性文字介绍"
    type="success"
    description="这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……"
  >
  </el-alert>
</template>
```

:::

### 带有 icon 和辅助性文字介绍

:::demo

```html
<template>
  <el-alert
    title="成功提示的文案"
    type="success"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon
  >
  </el-alert>
  <el-alert
    title="消息提示的文案"
    type="info"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon
  >
  </el-alert>
  <el-alert
    title="警告提示的文案"
    type="warning"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon
  >
  </el-alert>
  <el-alert
    title="错误提示的文案"
    type="error"
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon
  >
  </el-alert>
</template>
```
