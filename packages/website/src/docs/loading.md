## Loading 加载

加载数据时显示动效。

### 整页加载

页面数据加载时显示。

:::demo 当使用指令方式时，全屏遮罩需要添加`fullscreen`修饰符（遮罩会插入至 body 上），此时若需要锁定屏幕的滚动，可以使用`lock`修饰符；当使用服务方式时，遮罩默认即为全屏，无需额外设置。

```html
<template>
  <el-button
    type="primary"
    @click="openFullScreen1"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    指令方式
  </el-button>
  <el-button type="primary" @click="openFullScreen2"> 服务方式 </el-button>
</template>

<script>
  import { ref } from 'vue'
  import { ElLoading } from 'element3'
  export default {
    setup() {
      let fullscreenLoading = ref(false)
      function openFullScreen1() {
        fullscreenLoading.value = true
        setTimeout(() => {
          fullscreenLoading.value = false
        }, 2000)
      }
      function openFullScreen2(e) {
        const loading = ElLoading.service({
          // lock: true,
          // target: e.target,
          text: 'Loading...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
      }

      return { fullscreenLoading, openFullScreen1, openFullScreen2 }
    }
  }
</script>
```

:::

### 服务

Loading 还可以以服务的方式调用。引入 Loading 服务：

```javascript
import { ElLoading } from 'element3'
import { nextTick } from 'vue'
```

在需要调用时：

```javascript
ElLoading.service(options)
```

其中 `options` 参数为 Loading 的配置项，具体见下表。`ElLoading.service` 会返回一个 Loading 实例，可通过调用该实例的 `close` 方法来关闭它：

```javascript
let loadingInstance = ElLoading.service(options)
nextTick(() => {
  // 以服务的方式调用的 ElLoading 需要异步关闭
  loadingInstance.close()
})
```

需要注意的是，以服务的方式调用的全屏 ElLoading 是单例的：若在前一个全屏 ElLoading 关闭前再次调用全屏 ElLoading，并不会创建一个新的 ElLoading 实例，而是返回现有全屏 ElLoading 的实例：

```javascript
let loadingInstance1 = ElLoading.service({ fullscreen: true })
let loadingInstance2 = ElLoading.service({ fullscreen: true })
console.log(loadingInstance1 === loadingInstance2) // true
```

此时调用它们中任意一个的 `close` 方法都能关闭这个全屏 Loading。

:::

### Options

| 参数        | 说明                                                                                                                                       | 类型          | 可选值 | 默认值        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------ | ------------- |
| target      | Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 `document.querySelector`以获取到对应 DOM 节点 | object/string | —      | document.body |
| body        | 同 `v-loading` 指令中的 `body` 修饰符                                                                                                      | boolean       | —      | false         |
| fullscreen  | 同 `v-loading` 指令中的 `fullscreen` 修饰符                                                                                                | boolean       | —      | true          |
| lock        | 同 `v-loading` 指令中的 `lock` 修饰符                                                                                                      | boolean       | —      | false         |
| text        | 显示在加载图标下方的加载文案                                                                                                               | string        | —      | —             |
| spinner     | 自定义加载图标类名                                                                                                                         | string        | —      | —             |
| background  | 遮罩背景色                                                                                                                                 | string        | —      | —             |
| customClass | Loading 的自定义类名                                                                                                                       | string        | —      | —             |
