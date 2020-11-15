## Checkbox 多选框
一组备选项中进行多选

### 基础用法

单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox 按钮后的介绍。

:::demo 在`el-checkbox`元素中定义`v-model`绑定变量，单一的`checkbox`中，默认绑定变量的值会是`Boolean`，选中为`true`。

```html

<!-- `checked` 为 true 或 false -->
<el-checkbox v-model="checked">备选项</el-checkbox>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const checked = ref(true)
      return { checked }
    }
  }
</script>
```
:::

### 禁用状态

多选框不可用状态。

:::demo 设置`disabled`属性即可。

```html

<el-checkbox v-model="checked1" disabled>备选项1</el-checkbox>
<el-checkbox v-model="checked2" disabled>备选项</el-checkbox>

<script>
  import { reactive, toRefs } from 'vue'
  export default {
    setup() {
      const checked = reactive({
        checked1: false,
        checked2: true
      })
      return {...toRefs(checked)}
    }
  }
</script>
```
:::

### 多选框组

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

:::demo `checkbox-group`元素能把多个 checkbox 管理为一组，只需要在 Group 中使用`v-model`绑定`Array`类型的变量即可。 `el-checkbox` 的 `label`属性是该 checkbox 对应的值，若该标签中无内容，则该属性也充当 checkbox 按钮后的介绍。`label`与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。

```html

  <el-checkbox-group v-model="checkList">
    <el-checkbox label="复选框 A"></el-checkbox>
    <el-checkbox label="复选框 B"></el-checkbox>
    <el-checkbox label="复选框 C"></el-checkbox>
    <el-checkbox label="禁用" disabled></el-checkbox>
    <el-checkbox label="选中且禁用" disabled></el-checkbox>
  </el-checkbox-group>


<script>
  import { ref } from 'vue'
  export default {
    setup () {
      const checkList = ref(['选中且禁用','复选框 A'])
      return {
        checkList
      }
    }
  }
</script>
```
:::

### indeterminate 状态

`indeterminate` 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

:::demo

```html

<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
<div style="margin: 15px 0"></div>
<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
<el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
</el-checkbox-group>

<script>
  import { reactive, toRefs } from 'vue'

  const cityOptions = ['上海', '北京', '广州', '深圳']

  export default {
    setup() {
      const state = reactive({
        checkAll: false,
        checkedCities: ['上海', '北京'],
        cities: cityOptions, // modelValue 与 cities不能为同一个数组
        isIndeterminate: true
      })
      
      const handleCheckAllChange = val => {
        state.checkedCities = val ? [...cityOptions] : [] 
        state.isIndeterminate = false
      }
      const handleCheckedCitiesChange = value => {
        let checkedCount = value.length
        state.checkAll = checkedCount === state.cities.length
        state.isIndeterminate = checkedCount > 0 && checkedCount < state.cities.length
      }
      return {
        ...toRefs(state),
        handleCheckAllChange,
        handleCheckedCitiesChange
      }
    }
  }
</script>
```
:::

### 可选项目数量的限制

使用 `min` 和 `max` 属性能够限制可以被勾选的项目的数量。

:::demo

```html

<el-checkbox-group 
  v-model="checkedCities"
  :min="1"
  :max="2"
>
  <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
</el-checkbox-group>

<script>
  import { ref } from 'vue'

  const cityOptions = ['上海', '北京', '广州', '深圳']

  export default {
    setup() {
      const checkedCities = ref(['上海', '北京'])
      return {
        checkedCities,
        cities: cityOptions
      }
    }
  }
</script>
```

:::

### 按钮样式

按钮样式的多选组合。

:::demo 只需要把`el-checkbox`元素替换为`el-checkbox-button`元素即可。此外，Element 还提供了`size`属性。
```html

<div>
  <el-checkbox-group v-model="checkboxGroup1">
    <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="checkboxGroup2" size="medium">
    <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="checkboxGroup3" size="small">
    <el-checkbox-button v-for="city in cities" :label="city" :disabled="city === '北京'" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="checkboxGroup4" size="mini" disabled>
    <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
  </el-checkbox-group>
</div>

<script>
  import { reactive, toRefs } from 'vue'

  const cityOptions = ['上海', '北京', '广州', '深圳']

  export default {
    setup () {
      const checkboxGroups = reactive({
        checkboxGroup1: ['上海'],
        checkboxGroup2: ['上海'],
        checkboxGroup3: ['上海'],
        checkboxGroup4: ['上海']
      })
      return {
        ...toRefs(checkboxGroups),
        cities: cityOptions
      }
    }
  }
</script>
```
:::

### 带有边框

:::demo 设置`border`属性可以渲染为带有边框的多选框。
```html

<div>
  <el-checkbox v-model="checked1" label="备选项1" border></el-checkbox>
  <el-checkbox v-model="checked2" label="备选项2" border></el-checkbox>
</div>
<div style="margin-top: 20px">
  <el-checkbox v-model="checked3" label="备选项1" border size="medium"></el-checkbox>
  <el-checkbox v-model="checked4" label="备选项2" border size="medium"></el-checkbox>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="checkboxGroup1" size="small">
    <el-checkbox label="备选项1" border></el-checkbox>
    <el-checkbox label="备选项2" border disabled></el-checkbox>
  </el-checkbox-group>
</div>
<div style="margin-top: 20px">
  <el-checkbox-group v-model="checkboxGroup2" size="mini" disabled>
    <el-checkbox label="备选项1" border></el-checkbox>
    <el-checkbox label="备选项2" border></el-checkbox>
  </el-checkbox-group>
</div>

<script>
  import { reactive, toRefs } from 'vue'

  export default {
    setup () {
      const state = reactive({
        checked1: true,
        checked2: false,
        checked3: false,
        checked4: true,
        checkboxGroup1: [],
        checkboxGroup2: []
      })
      return { ...toRefs(state) }
    }
  }
</script>
```
:::

### Checkbox Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| modelValue / v-model | 绑定值 | string / number / boolean | — | — |
| label     | 选中状态的值（只有在`checkbox-group`或者绑定对象类型为`array`时有效）| string / number / boolean  |       —        |     —    |
| true-label | 选中时的值   | string / number | — |     true    |
| false-label | 没有选中时的值   | string / number    |      —         |     false    |
| disabled  | 是否禁用    | boolean   |  — | false   |
| border  | 是否显示边框  | boolean   | — | false   |
| size  | Checkbox 的尺寸，仅在 border 为真时有效  | string  | medium / small / mini | — |
| name | 原生 name 属性 | string    |      —         |     —    |
| checked  | 当前是否勾选    | boolean   |  — | false   |
| indeterminate  | 设置 indeterminate 状态，只负责样式控制    | boolean   |  — | false   |

### Checkbox Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 当绑定值变化时触发的事件 | 更新后的值 |

### Checkbox-group Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| modeValue / v-model | 绑定值 | array | — | — |
| size     | 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效   | string  | medium / small / mini  |    —     |
| disabled  | 是否禁用    | boolean   | — | false   |
| border  | 是否显示边框    | boolean   | — | false   |
| min     | 可被勾选的 checkbox 的最小数量   | number    |       —        |     —    |
| max     | 可被勾选的 checkbox 的最大数量   | number    |       —        |     —    |
| text-color  | 按钮形式的 Checkbox 激活时的文本颜色    | string   | — | #ffffff   |
| fill  | 按钮形式的 Checkbox 激活时的填充色和边框色    | string   | — | #409EFF   |

### Checkbox-group Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 当绑定值变化时触发的事件 | 更新后的值 |

### Checkbox-button Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | 选中状态的值（只有在`checkbox-group`或者绑定对象类型为`array`时有效）| string / number / boolean  |       —        |     —    |
| size  | CheckboxButton 的尺寸  | string  | medium / small / mini | — |
| true-label | 选中时的值   | string / number | — |     true    |
| false-label | 没有选中时的值   | string / number    |      —         |     false    |
| disabled  | 是否禁用    | boolean   |  — | false   |
| name | 原生 name 属性 | string    |      —         |     —    |
| checked  | 当前是否勾选    | boolean   |  — | —   |
