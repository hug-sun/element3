## Radio 单选框

在一组备选项中进行单选

### 基础用法

由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。

:::demo

```html
<el-radio :value="radio" label="1">备选项</el-radio>
<el-radio :value="radio" label="2">备选项</el-radio>

<script setup>
  import { ref } from 'vue'
  const radio = ref('2')
</script>
```

:::
