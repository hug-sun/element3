import Input from 'element-ui/packages/input/Input.vue'
import Form from 'element-ui/packages/form/Form.vue'
import FormItem from '../FormItem.vue'
import { mount } from '@vue/test-utils'

describe('FormItem', () => {
  it('label width', () => {
    const vm = mount(
      {
        components: {
          'el-form-item': FormItem,
          'el-form': Form,
          'el-input': Input
        },
        template: `
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      `,
        data() {
          return {
            form: {
              name: ''
            }
          }
        }
      },
      {
        global: {
          config: {
            globalProperties: {
              $ELEMENT: {}
            }
          }
        }
      }
    )

    const label = vm.find('.el-form-item__label')
    const content = vm.find('.el-form-item__content')

    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('活动名称')

    expect(label.attributes().style).toContain('width: 80px')
    expect(content.attributes().style).toContain('margin-left: 80px')
  })

  // it('auto label width', async () => {
  //   const wrapper = mount({
  //     components: {
  //       'el-form-item': FormItem,
  //       'el-form': Form,
  //       'el-input': Input
  //     },
  //     template: `
  //       <el-form ref="form" :model="form" label-width="auto">
  //         <el-form-item label="活动名称">
  //           <el-input v-model="form.name"></el-input>
  //         </el-form-item>
  //         <el-form-item label="活动备注信息" v-if="display">
  //           <el-input v-model="form.name"></el-input>
  //         </el-form-item>
  //       </el-form>
  //     `,
  //     data() {
  //       return {
  //         display: true,
  //         form: {
  //           name: '',
  //           intro: ''
  //         }
  //       }
  //     }
  //   }, {
  //     global: {
  //       config: {
  //         globalProperties: {
  //           $ELEMENT: {}
  //         }
  //       }
  //     }
  //   })

  //   // 获取一下表单autoLabelWidth，验证是否计算正确

  //   const formItems = wrapper.findAll('.el-form-item__content')
  //   const marginLeft1 = parseInt(formItems[0].element.style.marginLeft, 10)
  //   const marginLeft2 = parseInt(formItems[1].element.style.marginLeft, 10)
  //   // await nextTick()

  //   console.log();

  //   expect(marginLeft1 === marginLeft2).toBe(true)

  //   // wrapper.vm.display = false
  //   // await nextTick()

  //   // const formItem = wrapper.find('.el-form-item__content')
  //   // const newMarginLeft = parseInt(formItem.element.style.marginLeft, 10)
  //   // console.log(formItem.attributes());
  //   // expect(newMarginLeft < marginLeft1).toBe(true)

  // })

  // it('label position', done => {
  //   vm = createVue({
  //     template: `
  //       <div>
  //         <el-form :model="form" label-position="top" ref="labelTop">
  //           <el-form-item>
  //             <el-input v-model="form.name"></el-input>
  //           </el-form-item>
  //           <el-form-item>
  //             <el-input v-model="form.address"></el-input>
  //           </el-form-item>
  //         </el-form>
  //         <el-form :model="form" label-position="left" ref="labelLeft">
  //           <el-form-item>
  //             <el-input v-model="form.name"></el-input>
  //           </el-form-item>
  //           <el-form-item>
  //             <el-input v-model="form.address"></el-input>
  //           </el-form-item>
  //         </el-form>
  //       </div>
  //     `,
  //     data() {
  //       return {
  //         form: {
  //           name: '',
  //           address: ''
  //         }
  //       }
  //     }
  //   }, true)
  //   expect(vm.$refs.labelTop.$el.classList.contains('el-form--label-top')).to.be.true
  //   expect(vm.$refs.labelLeft.$el.classList.contains('el-form--label-left')).to.be.true
  //   done()
  // })
  // it('label size', () => {
  //   vm = createVue({
  //     template: `
  //       <div>
  //         <el-form :model="form" size="mini" ref="labelMini">
  //           <el-form-item>
  //             <el-input v-model="form.name"></el-input>
  //           </el-form-item>
  //         </el-form>
  //       </div>
  //     `,
  //     data() {
  //       return {
  //         form: {
  //           name: ''
  //         }
  //       }
  //     }
  //   }, true)
  //   expect(vm.$refs.labelMini.$el.children[0].classList.contains('el-form-item--mini')).to.be.true
  // })
  // it('show message', done => {
  //   vm = createVue({
  //     template: `
  //       <el-form :model="form" ref="form">
  //         <el-form-item label="活动名称" prop="name" :show-message="false"
  //           :rules="{
  //             required: true,
  //             message: '请输入活动名称',
  //             trigger: 'change',
  //             min: 3,
  //             max: 6
  //           }"
  //         >
  //           <el-input v-model="form.name"></el-input>
  //         </el-form-item>
  //       </el-form>
  //     `,
  //     data() {
  //       return {
  //         form: {
  //           name: ''
  //         }
  //       }
  //     }
  //   }, true)
  //   vm.$refs.form.validate(valid => {
  //     expect(valid).to.not.true
  //     vm.$refs.form.$nextTick(_ => {
  //       expect(vm.$el.querySelector('.el-form-item__error')).to.not.exist
  //       done()
  //     })
  //   })
  // })

  // it('form item nest', done => {
  //   vm = createVue({
  //     template: `
  //       <el-form ref="form" :model="form" :rules="rules">
  //         <el-form-item label="活动时间" required>
  //           <el-col :span="11">
  //             <el-form-item prop="date1">
  //               <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
  //             </el-form-item>
  //           </el-col>
  //           <el-col class="line" :span="2">-</el-col>
  //           <el-col :span="11">
  //             <el-form-item prop="date2">
  //               <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
  //             </el-form-item>
  //           </el-col>
  //         </el-form-item>
  //       </el-form>
  //     `,
  //     data() {
  //       return {
  //         form: {
  //           date1: '',
  //           date2: ''
  //         },
  //         rules: {
  //           date1: [
  //             { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
  //           ]
  //         }
  //       }
  //     },
  //     methods: {
  //       setValue() {
  //         this.name = 'jack'
  //         this.address = 'aaaa'
  //       }
  //     }
  //   }, true)
  //   vm.$refs.form.validate(valid => {
  //     expect(valid).to.not.true
  //     done()
  //   })
  // })
})
