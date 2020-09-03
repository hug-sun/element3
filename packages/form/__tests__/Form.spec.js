import FormItem from 'element-ui/packages/form-item/FormItem.vue'
import Form from 'element-ui/packages/form/Form.vue'
import { mount } from '@vue/test-utils'
import { mockWarn } from 'element-ui/test/unit/mocks/mockWarn'

describe('Form', () => {
  mockWarn()

  test(`should warn when doesn't pass a model prop`, () => {
    const wrapper = mount(Form)
    wrapper.vm.validate()
    expect(
      '[Element Warn][Form]model is required for validate to work!'
    ).toHaveBeenWarned()
  })

  test('validate', () => {
    const rules = {
      username: [{ required: true, message: '用户名为必填项' }]
    }
    const wrapper = mount({
      template: `
        <el-form :model="model" :rules="rules">
          <el-form-item prop="username"></el-form-item>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem
      },
      data() {
        return {
          model: {
            username: 'tom'
          },
          rules
        }
      }
    })

    const form = wrapper.findComponent(Form).componentVM
    const p = form.validate()
    expect(p).toBeDefined()
    expect(p.then).toBeDefined()
    p.then((result) => {
      expect(result).toBe(true)
    })

    form.validate((result) => {
      expect(result).toBe(true)
    })

    rules.username.push({ min: 5, message: '用户名最小长度为5' })

    form.validate((result) => {
      expect(result).toBe(false)
    })
  })

  test('validateField', () => {
    const wrapper = mount({
      template: `
        <el-form :model="model" :rules="rules">
          <el-form-item prop="username"></el-form-item>
          <el-form-item prop="password"></el-form-item>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem
      },
      data() {
        return {
          model: {
            username: 'tom',
            password: ''
          },
          rules: {
            username: [{ required: true, message: '用户名为必填项' }],
            password: [{ required: true, message: '密码为必填项' }]
          }
        }
      }
    })

    const form = wrapper.findComponent(Form).componentVM
    // 校验单个
    form.validateField('username', (errorMsg) => {
      expect(errorMsg).toBe('')
    })

    // 校验多个
    let counter = 0
    const callback = (errorMsg) => {
      if (counter === 0) {
        counter++
        expect(errorMsg).toBe('')
      } else {
        expect(errorMsg).toBe('密码为必填项')
      }
    }
    form.validateField(['username', 'password'], callback)
  })

  test('resetFields', () => {
    const model = {
      username: 'tom'
    }
    const wrapper = mount({
      template: `
        <el-form :model="model" :rules="rules">
          <el-form-item prop="username"></el-form-item>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem
      },
      data() {
        return {
          model
        }
      }
    })

    // 修改model，重置之后看是否恢复
    const form = wrapper.findComponent(Form).componentVM
    model.username = 'jerry'
    form.resetFields()
    expect(model.username).toBe('tom')
  })

  test('clearValidate', () => {
    const wrapper = mount({
      template: `
        <el-form :model="model" :rules="rules">
          <el-form-item prop="username"></el-form-item>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem
      },
      data() {
        return {
          model: {
            username: 'tom'
          },
          rules: {
            username: [{ min: 5, message: '用户名长度至少5位' }]
          }
        }
      }
    })

    const form = wrapper.findComponent(Form).componentVM
    const item = wrapper.findComponent(FormItem).componentVM
    // 执行校验
    form.validate()
    expect(item.validateMessage).toBe('用户名长度至少5位')
    // 清除校验
    form.clearValidate('username')
    expect(item.validateMessage).toBe('')
  })
})
