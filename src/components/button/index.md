## Button 按钮
### 基础用法
基础的按钮用法。

:::demo

```html	
<template>
	<div>
		<el-button>默认按钮</el-button>
		<el-button type="primary">主要按钮</el-button>
		<el-button type="success">成功按钮</el-button>
		<el-button type="info">信息按钮</el-button>
		<el-button type="warning">警告按钮</el-button>
		<el-button type="danger">危险按钮</el-button>
	</div>
	

</template>
```

:::


### 不同尺寸按钮
Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo

```html	
<template>
	<div>
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
