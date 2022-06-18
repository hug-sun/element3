## Link 文字链接
:::demo
```html
<div>
  <el-link>默认链接</el-link>
  <el-link type="primary">主要链接</el-link>
  <el-link type="success">成功链接</el-link>
  <el-link type="warning">警告链接</el-link>
  <el-link type="danger">危险链接</el-link>
  <el-link type="info">信息链接</el-link>
</div>
```
:::

### 下划线
:::demo
```html
<div>
  <el-link :underline="false">无下划线</el-link>
  <el-link>有下划线</el-link>
</div>
```
:::

### 禁用状态
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