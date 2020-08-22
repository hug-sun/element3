import Form from '../Form.vue'
import FormItem from '../../form-item/FormItem.vue'

import { mount } from '@vue/test-utils'

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
    const wrapper_top = mount(Form, {
      props: {
        labelPosition: 'top'
      }
    })

    const wrapper_left = mount(Form, {
      props: {
        labelPosition: 'left'
      }
    })

    expect(wrapper_top.find('.el-form').classes()).toContain('el-form--label-top')
    expect(wrapper_left.find('.el-form').classes()).toContain('el-form--label-left')
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
    const wrapper_form = mount({
      template: `<el-form label-width="80px">
        <el-form-item label="活动名称">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    const wrapper_formItem = mount({
      template: `<el-form>
        <el-form-item label="活动名称" label-width="80px">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    const wrapper_withPositionTop = mount({
      template: `<el-form labelPosition="top" label-width="80px">
        <el-form-item label="活动名称">
          <input />
        </el-form-item>
      </el-form>`,
      components
    })

    expect(wrapper_form.find('.el-form-item__label').element.style.width).toBe('80px')
    expect(wrapper_formItem.find('.el-form-item__label').element.style.width).toBe('80px')
    expect(wrapper_withPositionTop.find('.el-form-item__label').element.style.width).toBe('')
  })

  // todo autoWith 使用了dom的API getComputedStyle, 在单元测试中暂时还没办法获取到真正的宽度
  // it('auto label width', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-form label-width="auto">
  //         <el-form-item label="活动名称">
  //           <input />
  //         </el-form-item>
  //         <el-form-item label="活动备注信息" v-if="display">
  //           <input />
  //         </el-form-item>
  //       </el-form>
  //     `,
  //     data() {
  //       return {
  //         display: true
  //       }
  //     },
  //     components: {
  //       ElForm: Form,
  //       ElFormItem: FormItem
  //     }
  //   })

  //   const contents = wrapper.findAll('.el-form-item__content')

  //   const marginLeft = contents[0].element.style.marginLeft
  //   const marginLeft1 = contents[1].element.style.marginLeft
  //   wrapper.vm.display = false
  //   await wrapper.vm.$nextTick()

  //   const newMarginLeft = contents[0].element.style.marginLeft
  //   expect(marginLeft === marginLeft1).toBe(true)
  //   expect(newMarginLeft < marginLeft).toBe(true)
  // })

  // it('label size', () => {
  //   const wrapper_form = mount({
  //     template: `<el-form size="mini">
  //       <el-form-item>

  //       </el-form-item>
  //     </el-form>`,
  //     components
  //   })

  //   const wrapper_formItem = mount({
  //     template: `<el-form>
  //       <el-form-item size="mini">

  //       </el-form-item>
  //     </el-form>`,
  //     components
  //   })

  //   expect(wrapper_form.find('.el-form-item').classes()).toContain('el-form-item--mini')
  //   expect(wrapper_formItem.find('.el-form-item').classes()).toContain('el-form-item--mini')
  // })

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

    wrapper.vm.$refs.form.validate(valid => {
      expect(valid).toBe(false)
      wrapper.vm.$refs.form.$nextTick(_ => {
        expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
        done()
      })
    })
  })

  it('reset field', async() => {
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
    wrapper.findComponent(Form).vm.validate(valid => {
      expect(valid).toBe(false)
      done()
    })
  })

  it('validate event', done => {
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
              { required: true, message: '请输入活动名称', trigger: 'change'}
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
    wrapper.findComponent(FormItem).vm.$emit('el.form.change')

    setTimeout(() => {
      expect(wrapper.vm.valid.name).toEqual(true)
      expect(wrapper.vm.error.name).toEqual(null)

      wrapper.vm.setValue('name', '')
      wrapper.findComponent(FormItem).vm.$emit('el.form.change')
      setTimeout(() => {
        expect(wrapper.vm.valid.name).toEqual(false)
        expect(wrapper.vm.error.name).toEqual('请输入活动名称')
        done()
      }, 100)
    }, 100)
  })
})
