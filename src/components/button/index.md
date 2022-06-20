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

    <div>
		<el-button round>圆角按钮</el-button>
		<el-button type="primary" round>主要按钮</el-button>
		<el-button type="success" round>成功按钮</el-button>
		<el-button type="info" round>信息按钮</el-button>
		<el-button type="warning" round>警告按钮</el-button>
		<el-button type="danger" round>危险按钮</el-button>
	</div>
</template>
```

:::


### 不同尺寸按钮
Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo

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