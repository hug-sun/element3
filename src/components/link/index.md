# Link 文字链接

## 基础用法

设置不同类型的链接

:::demo
```html
<div>
  <el-link href="https://e3.shengxinjing.cn/" target="_blank">默认链接</el-link>
  <el-link type="primary">主要链接</el-link>
  <el-link type="success">成功链接</el-link>
  <el-link type="warning">警告链接</el-link>
  <el-link type="danger">危险链接</el-link>
  <el-link type="info">信息链接</el-link>
</div>
```
:::

## 下划线

链接不带下划线

:::demo
```html
<div>
  <el-link :underline="false">无下划线</el-link>
  <el-link>有下划线</el-link>
</div>
```
:::

## 禁用状态

:::demo
```html
<div>
  <el-link disabled>默认链接</el-link>
  <el-link type="primary" disabled>主要链接</el-link>
  <el-link type="success" disabled>成功链接</el-link>
  <el-link type="warning" disabled>警告链接</el-link>
  <el-link type="danger" disabled>危险链接</el-link>
  <el-link type="info" disabled>信息链接</el-link>
</div>
```
:::

## 图标

:::demo
```html
<div>
  <el-link icon="el-icon-edit">编辑</el-link>
  <el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link>
</div>
```
:::


## Link Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `type` | 设置不同类型的链接 | `string` | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `info` | `default` |
| `underline` | 控制是否显示下划线 | `boolean` | `true` \| `false` | `true` |
| `disabled` | 设置链接是否禁用 | `boolean` | `true` \| `false` | `true` |
| `icon` | 设置是否显示图标 | `string` | `IconProperties` | - |