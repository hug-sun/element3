# Container 布局组件

用于布局的容器组件，方便快速搭建页面的基本结构：

`<el-container>`：外层容器。当子元素中存在 `<el-header>` 或者 `<el-footer>` 时，全部子元素会进行垂直从上到下的排列，反之会进行水平从左到右的排列。

`<el-header>`：头部顶栏的容器。

`<el-aside>`：侧边栏的容器。

`<el-main>`：主要内容区域的容器。

`<el-footer>`：底部底栏的容器。

:::tip
以上组件都采用了 flex 布局，使用前请确定浏览器是否兼容。此外，`<el-container>` 的子元素只能是后四者以及`<el-container>`，后四者的父元素只能是`<el-container>`。后四者的子元素可以是其它元素，比如普通元素`div`、组件 `el-menu`等。
:::

## 常见页面布局

:::demo
```html
<!-- 上下 -->
<el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
</el-container>

<br/>

<!-- 上中下 -->
<el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
    <el-footer>Footer</el-footer>
</el-container>

<br/>

<!-- 左右 -->
<el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
</el-container>

<br/>

<!-- 上中<左右> -->
<el-container>
    <el-header>Header</el-header>
    <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
</el-container>

<br/>

<!-- 上中<左右<中下>> -->
<el-container>
    <el-header>Header</el-header>
    <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </el-container>
</el-container>

<br/>

<!-- 左右<上中> -->
<el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
    </el-container>
</el-container>

<br/>

<!-- 左右<上中下> -->
<el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</el-container>

<br/>

<style>
.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>
```
:::

## 实例

:::demo
```html
<el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
        <p v-for="item in asideList" :key="item">
           <a href="javascript:void(0);">{{item}}</a>
        </p>
    </el-aside>

    <el-container>
        <el-header>
            <div>{{headerTitle}}</div>
        </el-header>
        <el-main>
            <table style="width: 100%;">
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>address</th>
                </tr>
                <tr v-for="row in mainContentList" :key="row.id">
                    <td>{{row.id}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.address}}</td>
                </tr>
            </table>
        </el-main>
    </el-container>
</el-container>

<script lang="ts" setup>
const asideList = Array(20).fill(1).map((_, i) => `菜单项 ${ i + 1 }`);
const headerTitle = `Hello Wrold`
const mainContentList = Array(20).fill(1).map((_, i) => ({
    id: i + 1,
    name: `王小虎 ${ i + 1 }`,
    address: `浦东新区 唐镇 ${ i + 1 }`
}))
</script>

<style>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
    text-align: center;
}

.el-aside {
    color: #333;
}
</style>
```
:::

## Container Attributes

| 参数      | 说明             | 类型   | 可选值                | 默认值                                                                 |
| --------- | ---------------- | ------ | --------------------- | ---------------------------------------------------------------------- |
| direction | 子元素的排列方向 | string | horizontal（水平） / vertical（垂直） | 子元素中有 `el-header` 或 `el-footer` 时为 vertical，否则为 horizontal |

## Header Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 顶栏高度 | string | —      | 60px   |

## Aside Attributes

| 参数  | 说明       | 类型   | 可选值 | 默认值 |
| ----- | ---------- | ------ | ------ | ------ |
| width | 侧边栏宽度 | string | —      | 300px  |

## Footer Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 底栏高度 | string | —      | 60px   |