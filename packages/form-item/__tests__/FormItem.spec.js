import FormItem from '../FormItem.vue'
import { mount } from '@vue/test-utils'

describe('FormItem', () => {
  it('label', () => {
    const vm = mount({
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
    })

    const label = vm.find('label')
    const content = vm.find('.el-form-item__content')
    console.log(label);
    
    expect(label).toBeDefined()
    expect(label.text()).toBe('活动名称')
    expect(label.style.width).toBe('80px')
    expect(content.style.marginLeft).toBe('80px')
  })

  // it('label width', done => {
  //   mount(FormItem)
  //   vm = createVue({
  //     template: `
  //       <el-form ref="form" :model="form" label-width="80px">
  //         <el-form-item label="活动名称">
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
  //   expect(vm.$el.querySelector('.el-form-item__label').style.width).to.equal('80px')
  //   expect(vm.$el.querySelector('.el-form-item__content').style.marginLeft).to.equal('80px')
  //   done()
  // })
  // it('auto label width', async() => {
  //   vm = createVue({
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
  //   }, true)

  //   await waitImmediate()

  //   const formItems = vm.$el.querySelectorAll('.el-form-item__content')
  //   const marginLeft = parseInt(formItems[0].style.marginLeft, 10)
  //   const marginLeft1 = parseInt(formItems[1].style.marginLeft, 10)
  //   expect(marginLeft === marginLeft1).to.be.true

  //   vm.display = false
  //   await waitImmediate()

  //   const formItem = vm.$el.querySelector('.el-form-item__content')
  //   const newMarginLeft = parseInt(formItem.style.marginLeft, 10)
  //   expect(newMarginLeft < marginLeft).to.be.true
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
