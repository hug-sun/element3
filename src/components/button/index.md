## Button 按钮

### 基础用法
基础的按钮用法。

:::demo

```html
<template>
	<div style="margin-bottom:10px">
		<el-button>默认按钮</el-button>
		<el-button type="primary">主要按钮</el-button>
		<el-button type="success">成功按钮</el-button>
		<el-button type="info">信息按钮</el-button>
		<el-button type="warning">警告按钮</el-button>
		<el-button type="danger">危险按钮</el-button>
	</div>

    <div style="margin-bottom:10px">
		<el-button>朴素按钮</el-button>
		<el-button type="primary" plain>主要按钮</el-button>
		<el-button type="success" plain>成功按钮</el-button>
		<el-button type="info" plain>信息按钮</el-button>
		<el-button type="warning" plain>警告按钮</el-button>
		<el-button type="danger" plain>危险按钮</el-button>
	</div>

    <div style="margin-bottom:10px">
		<el-button round>圆角按钮</el-button>
		<el-button type="primary" round size="small">主要按钮</el-button>
		<el-button type="success" round size="small">成功按钮</el-button>
		<el-button type="info" round size="small">信息按钮</el-button>
		<el-button type="warning" round size="small">警告按钮</el-button>
		<el-button type="danger" round size="small">危险按钮</el-button>
	</div>

    <div>
		<el-button icon="el-icon-search" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="success" icon="el-icon-check" circle></el-button>
        <el-button type="info" icon="el-icon-message" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </div>
</template>
```

:::


### 禁用状态
按钮不可用状态。

:::demo

```html
<template>
	<div style="margin-bottom:10px">
		<el-button disabled>默认按钮</el-button>
        <el-button type="primary" disabled>主要按钮</el-button>
        <el-button type="success" disabled>成功按钮</el-button>
        <el-button type="info" disabled>信息按钮</el-button>
        <el-button type="warning" disabled>警告按钮</el-button>
        <el-button type="danger" disabled>危险按钮</el-button>
	</div>

    <div style="margin-bottom:10px">
		<el-button plain disabled>朴素按钮</el-button>
        <el-button type="primary" plain disabled>主要按钮</el-button>
        <el-button type="success" plain disabled>成功按钮</el-button>
        <el-button type="info" plain disabled>信息按钮</el-button>
        <el-button type="warning" plain disabled>警告按钮</el-button>
        <el-button type="danger" plain disabled>危险按钮</el-button>
	</div>

</template>
```

:::


### 加载Loading
点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo

```html
<template>
	<div style="margin-bottom:10px">
	  <el-button type="primary" :loading="true">加载中</el-button>
	</div>
</template>
```
:::


### 不同尺寸按钮
Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<template>
	<div style="margin-bottom:10px">
		<el-button>默认按钮</el-button>
		<el-button size="medium">中等按钮</el-button>
		<el-button size="small">小型按钮</el-button>
		<el-button size="mini">超小按钮</el-button>
	</div>

	<div>
		<el-button>默认按钮</el-button>
		<el-button size="medium" round>中等按钮</el-button>
		<el-button size="small" round>小型按钮</el-button>
		<el-button size="mini" round>超小按钮</el-button>
	</div>
</template>
```

:::


### Button原生type类型
button、submit、reset通过设置native-type属性来配置它们。

:::demo

```html
<template>
    <div>
		<el-button>默认button类型</el-button>
		<el-button native-type="button">显式设置button类型</el-button>
		<el-button native-type="submit">submit类型</el-button>
		<el-button native-type="reset">reset类型</el-button>
	</div>
</template>
```
:::


### Attributes

| 参数        | 说明           | 类型    | 可选值                                             | 默认值 |
| ----------- | -------------- | ------- | -------------------------------------------------- | ------ |
| size        | 尺寸           | string  | medium / small / mini                              | —      |
| type        | 类型           | string  | primary / success / warning / danger / info / text | —      |
| plain       | 是否朴素按钮   | boolean | —                                                  | false  |
| round       | 是否圆角按钮   | boolean | —                                                  | false  |
| circle      | 是否圆形按钮   | boolean | —                                                  | false  |
| loading     | 是否加载中状态 | boolean | —                                                  | false  |
| disabled    | 是否禁用状态   | boolean | —                                                  | false  |
| icon        | 图标类名       | string  | —                                                  | —      |
| autofocus   | 是否默认聚焦   | boolean | —                                                  | false  |
| native-type | 原生 type 属性 | string  | button / submit / reset                            | button |
