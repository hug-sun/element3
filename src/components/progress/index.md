## Progress 进度条

用于显示各种进度

### 线

进度条可以是个线，可内可外，可高可矮，可有可无，可静可动。

:::demo
  ```html
  <el-progress :percentage=percentage></el-progress>
  <el-progress :percentage=percentage :show-indicator='false'></el-progress>
  <el-progress :percentage=percentage indicator-placement='inside' :height='20'></el-progress>
  <el-progress :percentage=percentage indicator-placement='inside' :height='30' processing></el-progress>

  <el-progress status='success' :percentage=percentage></el-progress>
  <el-progress status='success' :percentage=percentage :show-indicator='false'></el-progress>
  <el-progress status='success' :percentage=percentage indicator-placement='inside' :height='20'></el-progress>
  <el-progress status='success' :percentage=percentage indicator-placement='inside' :height='30' processing></el-progress>

  <el-progress status='warning' :percentage=percentage></el-progress>
  <el-progress status='warning' :percentage=percentage :show-indicator='false'></el-progress>
  <el-progress status='warning' :percentage=percentage indicator-placement='inside' :height='20'></el-progress>
  <el-progress status='warning' :percentage=percentage indicator-placement='inside' :height='30' processing></el-progress>

  <el-progress status='error' :percentage=percentage></el-progress>
  <el-progress status='error' :percentage=percentage :show-indicator='false'></el-progress>
  <el-progress status='error' :percentage=percentage indicator-placement='inside' :height='20'></el-progress>
  <el-progress status='error' :percentage=percentage indicator-placement='inside' :height='30' processing></el-progress>

  <br />
  <el-button icon="el-icon-minus" @click='decrease'></el-button>
  <el-button icon="el-icon-plus" @click='increase'></el-button>
  <script>
    import { ref } from 'vue'
    export default {
      setup() {

        const percentage = ref(30)

        function increase() {
          percentage.value += 10
          if (percentage.value >= 100) {
            percentage.value = 100
          }
        }

        function decrease() {
          percentage.value -= 10
          if (percentage.value <= 0) {
            percentage.value = 0
          }
        }

        return {
          percentage,
          increase,
          decrease,
        }
      }
    }
  </script>

  <style>
    .el-progress {
      margin-top: 3px;
    }
  </style>
 ```
:::

### 圈

进度条可以是个圆圈，可大可小，可静可动。

:::demo
```html
  <el-progress type='circle' :percentage='percentage'></el-progress>
  <el-progress type='circle' status='success' :percentage='percentage'></el-progress>
  <el-progress type='circle' status='warning' :percentage='percentage'></el-progress>
  <el-progress type='circle' status='error' :percentage='percentage'></el-progress>

  <el-progress type='circle' :height="100" :percentage='percentage' processing></el-progress>
  <el-progress type='circle' :height="100" status='success' processing :percentage='percentage'></el-progress>


  <br />
  <el-button icon="el-icon-minus" @click='decrease'></el-button>
  <el-button icon="el-icon-plus" @click='increase'></el-button>
  <script>
    import { ref } from 'vue'
    export default {
      setup() {

        const percentage = ref(30)

        function increase() {
          percentage.value += 10
          if (percentage.value >= 100) {
            percentage.value = 100
          }
        }

        function decrease() {
          percentage.value -= 10
          if (percentage.value <= 0) {
            percentage.value = 0
          }
        }

        return {
          percentage,
          increase,
          decrease,
        }
      }
    }
  </script>

  <style>
    .el-progress {
      margin-top: 3px;
    }
  </style>
```
:::

### 仪表板

进度条可以是个仪表盘，可大可小，可静可动。

:::demo
```html
  <el-progress type='dashboard' :percentage='percentage'></el-progress>
  <el-progress type='dashboard' status='success' :percentage='percentage'></el-progress>
  <el-progress type='dashboard' status='warning' :percentage='percentage'></el-progress>
  <el-progress type='dashboard' status='error' :percentage='percentage'></el-progress>

  <el-progress type='dashboard' :height="100" :percentage='percentage' processing></el-progress>
  <el-progress type='dashboard' :height="100" status='success' processing :percentage='percentage'></el-progress>


  <br />
  <el-button icon="el-icon-minus" @click='decrease'></el-button>
  <el-button icon="el-icon-plus" @click='increase'></el-button>
  <script>
    import { ref } from 'vue'
    export default {
      setup() {

        const percentage = ref(30)

        function increase() {
          percentage.value += 10
          if (percentage.value >= 100) {
            percentage.value = 100
          }
        }

        function decrease() {
          percentage.value -= 10
          if (percentage.value <= 0) {
            percentage.value = 0
          }
        }

        return {
          percentage,
          increase,
          decrease,
        }
      }
    }
  </script>

  <style>
    .el-progress {
      margin-top: 3px;
    }
  </style>
```
:::

###  你可以自定义颜色

如果你不喜欢默认的颜色

:::demo
```html
  <el-progress color='pink' :percentage='50' :height='30' :show-indicator='false'></el-progress>

  <el-progress type='circle' color='#FFA000' :percentage='50' :height='100' :show-indicator='false' processing></el-progress>

  <el-progress type='dashboard' color='rgba(255,16,143,0.5)' :percentage='50' :height='100' :show-indicator='false'></el-progress>
```
:::


### Progress 属性

属性 | 说明 | 类型 | 可选值 | 默认值
-- | -- | -- | -- | --
`type` | 进度条类型 | `string` | `line` \| `circle` \| `dashboard` | `line`
`status` | 进度条状态 | `string` | `success` \| `error` \| `warning` | —
`color` | 进度条颜色 | `string` | `ccsProperties` | —
`propcessing` | 处理中的状态 | `boolean` | `true` \| `false` | `false`
`percentage` | 百分比值 | `number` |` 0 ~ 100` | `0`
`indicator-placement` | 指标显示位置 | `string` | `inside` \| `outerside` | `outerside`
`show-indicator` | 是否显示指标 | `boolean` | `true` \| `false` | `true`
`height` | 进度条高度 | `number` | — | —