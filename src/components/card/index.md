# Card 卡片

## 基本使用
:::demo
```html
<el-card>这是一个卡片</el-card>
```
:::


## 标题
:::demo
```html
<el-card>这是一个卡片</el-card>
<el-card header="header内容">这是一个带head卡片</el-card>
```
:::


## 自定义样式
:::demo
```html
<el-card header="标题" :body-style="{ padding: '0px', borderRadius: '4px' }">这是一个圆角卡片</el-card>
```
:::


## 阴影
可对阴影的显示进行配置。

:::demo 通过`shadow`属性设置卡片阴影出现的时机：`always`(一直存在)、`hover`(鼠标滑过)或`never`(无阴影)。

<div>
  <el-card shadow="always"> 总是显示 </el-card>
  <el-card shadow="hover"> 鼠标悬浮时显示 </el-card>
  <el-card shadow="never"> 从不显示 </el-card>
</div>
:::
