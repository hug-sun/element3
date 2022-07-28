## Radio 单选框

在一组备选项中进行单选

### 基础用法

由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。

:::demo

```html
<el-radio v-model="radio" label="1">备选项</el-radio>
<el-radio v-model="radio" label="2">备选项</el-radio>

<script setup>
  import { ref } from 'vue'
  const radio = ref('2')
</script>
```

:::


### 禁用状态

单选框不可用的状态。

只要在el-radio元素中设置disabled属性即可，它接受一个Boolean，true为禁用。
:::demo

```html
<el-radio disabled :value="radio" label="禁用">备选项</el-radio>
<el-radio disabled :value="radio" label="选中且禁用">备选项</el-radio>

<script setup>
  import { ref } from 'vue'
  const radio = ref('选中且禁用')
</script>
```

:::


### 单选框组

适用于在多个互斥的选项中选择的场景

:::demo

```html
<el-radio-group v-model="radio">
  <el-radio :label="3">备选项</el-radio>
  <el-radio :label="6">备选项</el-radio>
  <el-radio :label="9">备选项</el-radio>
</el-radio-group>

<script setup>
  import { ref } from 'vue'
  const radio = ref(6)
</script>
```

:::
