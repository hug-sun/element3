## Divider 分割线

区隔内容的分割线。

### 基础用法

对不同章节的文本段落进行分割。

:::demo

```vue
<div>
  <span>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</span>
  <el-divider></el-divider>
  <span>少量的邪恶足以抵消全部高贵的品质, 害得人声名狼藉</span>
</div>
```

:::

### 设置文案

可以在分割线上自定义文案内容。

:::demo

```vue
<div>
  <span>头上一片晴天，心中一个想念</span>
  <el-divider content-position="left">少年包青天</el-divider>
  <span>饿了别叫妈, 叫饿了么</span>
  <el-divider>好的美团</el-divider>
  <span>为了无法计算的价值</span>
  <el-divider content-position="right">阿里云</el-divider>
</div>
```

:::

### 垂直分割

:::demo

```vue
<div>
  <span>雨纷纷</span>
  <el-divider direction="vertical"></el-divider>
  <span>旧故里</span>
  <el-divider direction="vertical"></el-divider>
  <span>草木深</span>
</div>
```

:::

### 设置不同样式

可以更改分割线的样式

:::demo

```vue
<div>
  <span>我方了</span>
  <el-divider divider-style="dashed"></el-divider>
  <span>我圆了</span>
  <el-divider divider-style="dotted"></el-divider>
  <span>双倍快乐</span>
  <el-divider divider-style="double"></el-divider>
</div>
```

:::

### 设置不同颜色

可以在分割线上自定义颜色和主题。

:::demo

```vue
<div>
  <span>我绿了</span>
  <el-divider color="green">暗黑3</el-divider>
  <span>暗黑模式</span>
  <el-divider dark color="green">暗黑3</el-divider>
</div>
```

:::

### Divider Attributes

| 参数                | 说明                 | 类型    | 可选值                           | 默认值     |
| ------------------ | -------------------- | ------ | ------------------------------- | ---------- |
| `direction`        | 设置分割线方向         | `string` | `horizontal` \| `vertical`            | `horizontal` |
| `content-position` | 设置分割线文案的位置    | `string` | `left` \| `right` \| `center`            | `center`     |
| `divider-style`    | 设置分割线样式         | `string` | `solid` \| `dotted` \| `dashed` \| `double` | `solid` |
| `color`            | 设置分割线颜色         | `string` | `CSSProperties` | - |
| `dark`             | 设置分割线主题         | `boolean`| `true` \| `false`| `false` |
