## Form 表单

由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据

### 典型表单

包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。

:::demo 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker

```html
<el-form ref="formRef" :model="form" label-width="auto">
  <el-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-form-item>
  <el-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>

<script>
  import { ref, reactive, toRefs } from 'vue'
  export default {
    setup() {
      const formRef = ref(null)
      const data = reactive({
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      })
      const onSubmit = () => {
        console.log('submit!')
      }

      return {
        ...toRefs(data),
        formRef,
        onSubmit
      }
    }
  }
</script>
```

:::

### 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

:::demo 设置 `inline` 属性可以让表单域变为行内的表单域

```html
<el-form :inline="true" :model="formInline" class="demo-form-inline">
  <el-form-item label="审批人">
    <el-input v-model="formInline.user" placeholder="审批人"></el-input>
  </el-form-item>
  <el-form-item label="发送通知">
    <el-switch v-model="formInline.delivery"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>
<script>
  import { reactive, toRefs } from 'vue'
  export default {
    setup() {
      const data = reactive({
        formInline: {
          user: '',
          delivery: false
        }
      })
      const onSubmit = () => {
        console.log('submit!')
      }

      return {
        ...toRefs(data),
        onSubmit
      }
    }
  }
</script>
```

:::

### 对齐方式

根据具体目标和制约因素，选择最佳的标签对齐方式。

:::demo 通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`，当设为 `top` 时标签会置于表单域的顶部

```html
<el-radio-group v-model="labelPosition" size="small">
  <el-radio-button label="left">左对齐</el-radio-button>
  <el-radio-button label="right">右对齐</el-radio-button>
  <el-radio-button label="top">顶部对齐</el-radio-button>
</el-radio-group>
<div style="margin: 20px;"></div>
<el-form
  :label-position="labelPosition"
  label-width="80px"
  :model="formLabelAlign"
>
  <el-form-item label="名称">
    <el-input v-model="formLabelAlign.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-input v-model="formLabelAlign.region"></el-input>
  </el-form-item>
  <el-form-item label="活动形式">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
</el-form>
<script>
  import { reactive, toRefs, ref } from 'vue'
  export default {
    setup() {
      const labelPosition = ref('right')
      const data = reactive({
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        }
      })
      return {
        labelPosition,
        ...toRefs(data)
      }
    }
  }
</script>
```

:::

### 表单验证

在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

:::demo Form 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并将 Form-Item 的 `prop` 属性设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

```html
<el-form
  :model="ruleForm"
  :rules="rules"
  ref="form"
  label-width="100px"
  class="demo-ruleForm"
>
  <el-form-item label="活动名称" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域" prop="region">
    <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="即时配送" prop="delivery">
    <el-switch v-model="ruleForm.delivery"></el-switch>
  </el-form-item>
  <el-form-item label="活动性质" prop="type">
    <el-checkbox-group v-model="ruleForm.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="特殊资源" prop="resource">
    <el-radio-group v-model="ruleForm.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="活动形式" prop="desc">
    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')"
      >立即创建</el-button
    >
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
<script>
  import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
  export default {
    setup() {
      const form = ref(null)
      const ruleForm = reactive({
        ruleForm: {
          name: '',
          region: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      })
      const rules = reactive({
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change'
            }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
        }
      })
      function submitForm() {
        form.value.validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
      function resetForm() {
        form.value.resetFields()
      }

      return {
        form,
        ...toRefs(ruleForm),
        ...toRefs(rules),
        submitForm,
        resetForm
      }
    }
  }
</script>
```

:::

### 自定义校验规则

这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。

:::demo 本例还使用`status-icon`属性为输入框添加了表示校验结果的反馈图标。

```html
<el-form
  :model="ruleForm"
  status-icon
  :rules="rules"
  ref="ruleForm"
  label-width="100px"
  class="demo-ruleForm"
>
  <el-form-item label="密码" prop="pass">
    <el-input
      type="password"
      v-model="ruleForm.pass"
      autocomplete="off"
    ></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input
      type="password"
      v-model="ruleForm.checkPass"
      autocomplete="off"
    ></el-input>
  </el-form-item>
  <el-form-item label="年龄" prop="age">
    <el-input v-model.number="ruleForm.age"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(parseInt(value))) {
            callback(new Error('请输入数字值'))
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          pass: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }],
          age: [{ validator: checkAge, trigger: 'blur' }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
```

:::

:::tip
自定义校验 callback 必须被调用。 更多高级用法可参考 [async-validator](https://github.com/yiminghe/async-validator)。
:::

### Form Attributes

| 参数                    | 说明                                                                                      | 类型    | 可选值                | 默认值 |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------- | --------------------- | ------ |
| model                   | 表单数据对象                                                                              | object  | —                     | —      |
| rules                   | 表单验证规则                                                                              | object  | —                     | —      |
| inline                  | 行内表单模式                                                                              | boolean | —                     | false  |
| label-position          | 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 `label-width`                   | string  | right/left/top        | right  |
| label-width             | 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 `auto`。 | string  | —                     | —      |
| label-suffix            | 表单域标签的后缀                                                                          | string  | —                     | —      |
| hide-required-asterisk  | 是否显示必填字段的标签旁边的红色星号                                                      | boolean | —                     | false  |
| show-message            | 是否显示校验错误信息                                                                      | boolean | —                     | true   |
| inline-message          | 是否以行内形式展示校验信息                                                                | boolean | —                     | false  |
| status-icon             | 是否在输入框中显示校验结果反馈图标                                                        | boolean | —                     | false  |
| validate-on-rule-change | 是否在 `rules` 属性改变后立即触发一次验证                                                 | boolean | —                     | true   |
| size                    | 用于控制该表单内组件的尺寸                                                                | string  | medium / small / mini | —      |
| disabled                | 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效         | boolean | —                     | false  |

### Form Methods

| 方法名        | 说明                                                                                                                                                                 | 参数                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| validate      | 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise | Function(callback: Function(boolean, object))                              |
| validateField | 对部分表单字段进行校验的方法                                                                                                                                         | Function(props: array \| string, callback: Function(errorMessage: string)) |
| resetFields   | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                                                                                           | —                                                                          |
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果                                                             | Function(props: array \| string)                                           |

### Form Events

| 事件名称 | 说明                   | 回调参数                                                   |
| -------- | ---------------------- | ---------------------------------------------------------- |
| validate | 任一表单项被校验后触发 | 被校验的表单项 prop 值，校验是否通过，错误消息（如果存在） |

### Form-Item Attributes

| 参数           | 说明                                                                         | 类型    | 可选值                            | 默认值 |
| -------------- | ---------------------------------------------------------------------------- | ------- | --------------------------------- | ------ |
| prop           | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string  | 传入 Form 组件的 `model` 中的字段 | —      |
| label          | 标签文本                                                                     | string  | —                                 | —      |
| label-width    | 表单域标签的的宽度，例如 '50px'。支持 `auto`。                               | string  | —                                 | —      |
| required       | 是否必填，如不设置，则会根据校验规则自动生成                                 | boolean | —                                 | false  |
| rules          | 表单验证规则                                                                 | object  | —                                 | —      |
| error          | 表单域验证错误信息, 设置该值会使表单验证状态变为`error`，并显示该错误信息    | string  | —                                 | —      |
| show-message   | 是否显示校验错误信息                                                         | boolean | —                                 | true   |
| inline-message | 以行内形式展示校验信息                                                       | boolean | —                                 | false  |
| size           | 用于控制该表单域下组件的尺寸                                                 | string  | medium / small / mini             | -      |

### Form-Item Slot

| name  | 说明             |
| ----- | ---------------- |
| —     | Form Item 的内容 |
| label | 标签文本的内容   |

### Form-Item Scoped Slot

| name  | 说明                                           |
| ----- | ---------------------------------------------- |
| error | 自定义表单校验信息的显示方式，参数为 { error } |

### Form-Item Methods

| 方法名        | 说明                                                 | 参数 |
| ------------- | ---------------------------------------------------- | ---- |
| resetField    | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | -    |
| clearValidate | 移除该表单项的校验结果                               | -    |
