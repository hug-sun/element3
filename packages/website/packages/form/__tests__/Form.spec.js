import Form from '../Form.vue'
import FormItem from '../../form-item/FormItem.vue'

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const components = {
  ElForm: Form,
  ElFormItem: FormItem
}

describe('Form', () => {
  it('label', () => {
    const wrapper = mount({
      template: `<el-form>
        <el-form-item label="活动名称">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    expect(wrapper.find('.el-form-item__label').text()).toBe('活动名称')
  })

  it('label position', () => {
    const wrapperTop = mount(Form, {
      props: {
        labelPosition: 'top'
      }
    })

    const wrapperLeft = mount(Form, {
      props: {
        labelPosition: 'left'
      }
    })

    expect(wrapperTop.find('.el-form').classes()).toContain(
      'el-form--label-top'
    )
    expect(wrapperLeft.find('.el-form').classes()).toContain(
      'el-form--label-left'
    )
  })

  it('inline form', () => {
    const wrapper = mount(Form, {
      props: {
        inline: true
      }
    })

    expect(wrapper.find('.el-form').classes()).toContain('el-form--inline')
  })

  it('label with', () => {
    const wrapperForm = mount({
      template: `<el-form label-width="80px">
        <el-form-item label="活动名称">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    const wrapperFormItem = mount({
      template: `<el-form>
        <el-form-item label="活动名称" label-width="80px">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    const wrapperWithPositionTop = mount({
      template: `<el-form labelPosition="top" label-width="80px">
        <el-form-item label="活动名称">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    expect(wrapperForm.find('.el-form-item__label').element.style.width).toBe(
      '80px'
    )
    expect(
      wrapperFormItem.find('.el-form-item__label').element.style.width
    ).toBe('80px')
    expect(
      wrapperWithPositionTop.find('.el-form-item__label').element.style.width
    ).toBe('')
  })

  it('show message', (done) => {
    const wrapper = mount({
      template: `<el-form :model="form" ref="form">
        <el-form-item label="活动名称" prop="name" :show-message="false"
          :rules="{
            required: true,
            message: '请输入活动名称',
            trigger: 'change',
            min: 3,
            max: 6
          }"
        >
          <input v-model="form.name" />
        </el-form-item>
      </el-form>`,
      components,
      data() {
        return {
          form: {
            name: ''
          }
        }
      }
    })

    wrapper.vm.$refs.form.validate((valid) => {
      expect(valid).toBe(false)
      wrapper.vm.$refs.form.$nextTick(() => {
        expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
        done()
      })
    })
  })

  it('reset field', async () => {
    const wrapper = mount({
      template: `<el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="活动名称" prop="name">
          <input v-model="form.name" />
        </el-form-item>
        <el-form-item label="活动地址" prop="address">
          <input v-model="form.address" />
        </el-form-item>
      </el-form>`,
      components,
      data() {
        return {
          form: {
            name: '',
            address: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ]
          }
        }
      },
      methods: {
        setValue() {
          this.form.name = 'jack'
          this.form.address = 'aaaa'
        }
      }
    })
    wrapper.vm.setValue()
    wrapper.vm.$refs.form.resetFields()
    await wrapper.vm.$refs.form.$nextTick()

    expect(wrapper.vm.form.name).toEqual('')
    expect(wrapper.vm.form.address).toEqual('')
  })

  it('clear validate', (done) => {
    const wrapper = mount({
      template: `
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="活动名称" prop="name">
            <input v-model="form.name" />
          </el-form-item>
        </el-form>
      `,
      components,
      data() {
        return {
          form: {
            name: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' }
            ]
          }
        }
      }
    })

    const form = wrapper.vm.$refs.form
    form.validate((valid) => console.log(valid))
    form.$nextTick(() => {
      expect(wrapper.find('.el-form-item__error').text()).toBe('请输入活动名称')
      form.clearValidate(['name'])
      setTimeout(() => {
        expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
        done()
      }, 100)
    })
  })

  it('form item nest', (done) => {
    const wrapper = mount({
      template: `<el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="活动信息" required>
            <el-form-item prop="name">
              <input v-model="form.name" placeholder="活动名称" />
            </el-form-item>
            <el-form-item prop="address">
              <input v-model="form.address" placeholder="活动区域" />
            </el-form-item>
        </el-form-item>
      </el-form>`,
      components,
      data() {
        return {
          form: {
            name: '',
            address: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ]
          }
        }
      }
    })
    wrapper.findComponent(Form).vm.validate((valid) => {
      expect(valid).toBe(false)
      done()
    })
  })

  it('validate event', (done) => {
    const wrapper = mount({
      template: `<el-form :model="form" :rules="rules" ref="form" @validate="onValidate">
        <el-form-item label="活动名称" prop="name">
          <input v-model="form.name" />
        </el-form-item>
      </el-form>`,
      components,
      data() {
        return {
          form: {
            name: ''
          },
          valid: {
            name: null
          },
          error: {
            name: null
          },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'change' }
            ]
          }
        }
      },
      methods: {
        onValidate(prop, valid, msg) {
          this.valid[prop] = valid
          this.error[prop] = msg
        },
        setValue(prop, value) {
          this.form[prop] = value
        }
      }
    })

    wrapper.vm.setValue('name', 'name')
    wrapper.findComponent(FormItem).vm.validate('change')

    setTimeout(() => {
      expect(wrapper.vm.valid.name).toEqual(true)
      expect(wrapper.vm.error.name).toEqual(null)

      wrapper.vm.setValue('name', '')
      wrapper.findComponent(FormItem).vm.validate('change')
      setTimeout(() => {
        expect(wrapper.vm.valid.name).toEqual(false)
        expect(wrapper.vm.error.name).toEqual('请输入活动名称')
        done()
      }, 100)
    }, 100)
  })

  it('modify rules', async () => {
    const rules = {
      name: [{ min: 5, message: '用户名至少5位' }]
    }
    const wrapper = mount({
      template: `
        <el-form :model="form" :rules="rules">
          <el-form-item label="活动名称" prop="name">
          </el-form-item>
        </el-form>
      `,
      components,
      data() {
        return {
          form: {
            name: 'tom'
          },
          rules
        }
      }
    })

    const form = wrapper.findComponent(Form).vm
    form.validate((valid) => console.log(valid))
    await nextTick()
    // 开始校验有错误
    expect(wrapper.find('.el-form-item__error').text()).toBe('用户名至少5位')
    // 修改规则后重新校验，错误信息消失
    rules.name[0].min = 3
    setTimeout(() => {
      expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
    }, 500)
  })
})
