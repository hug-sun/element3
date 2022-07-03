# Badge 标记

出现在按钮、图标旁的数字或状态标记。

## 基础用法

展示新消息数量。

:::demo

```html
<el-badge :value="12" class="badge-item">
  <el-button size="small">评论</el-button>
</el-badge>
<el-badge :value="3" class="badge-item">
  <el-button size="small">回复</el-button>
</el-badge>
<el-badge :value="1" class="badge-item" type="primary">
  <el-button size="small">评论</el-button>
</el-badge>
<el-badge :value="2" class="badge-item" type="warning">
  <el-button size="small">回复</el-button>
</el-badge>

<style>
  .badge-item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
```

:::

## 最大值

可自定义最大值

:::demo

```html
<el-badge :value="200" :max="99" class="badge-item">
  <el-button size="small">评论</el-button>
</el-badge>
<el-badge :value="100" :max="10" class="badge-item">
  <el-button size="small">回复</el-button>
</el-badge>

<style>
  .badge-item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
```

:::

## 自定义内容

可以显示数字以外的文本内容。

:::demo

```html
<el-badge value="new" class="badge-item">
  <el-button size="small">评论</el-button>
</el-badge>
<el-badge value="hot" class="badge-item">
  <el-button size="small">回复</el-button>
</el-badge>

<style>
  .badge-item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
```

:::

## 小红点

以小红点的形式标注需要关注的内容。

:::demo

```html
<el-badge is-dot class="badge-item">数据查询</el-badge>

<style>
  .badge-item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
```

:::
