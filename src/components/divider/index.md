## Divider 分割线

区隔内容的分割线。

### 基础用法

对不同章节的文本段落进行分割。

:::demo

```html
<div>
  <span>轻轻敲醒沉睡的心灵，慢慢张开你的眼睛.</span>
  <el-divider></el-divider>
  <span>春风不解风情，吹动少年的心</span>
</div>
```

:::

### 设置文案

可以在分割线上自定义文案内容。

:::demo

```html
<div>
  <span>虽然说代码没什么意义，但是组件库可以让代码变得更加美丽</span>
  <el-divider content-position="left">Element3</el-divider>
  <span>饿了别叫妈, 叫饿了么</span>
  <el-divider>好的美团</el-divider>
  <span>为了无法计算的价值</span>
  <el-divider content-position="right">阿里云</el-divider>
</div>
```

:::

### 垂直分割

:::demo

```html
<div>
  <span>王者荣耀</span>
  <el-divider direction="vertical"></el-divider>
  <span>英雄联盟</span>
  <el-divider direction="vertical"></el-divider>
  <span>Dota</span>
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
