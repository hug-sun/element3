import Input from '../Input.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// todo
// autosize case:  jest jsdom 不会真实计算高度，所以case要调整。但是，已在浏览器测试通过。

const globalOption = {
  config: {
    globalProperties: {
      $ELEMENT: {
        size: '',
        zIndex: 2000
      }
    }
  }
}

describe('Input.vue', () => {
  describe('props', () => {
    it('create', async () => {
      const wrapper = mount(
        {
          template: `
                    <el-input
                        :minlength="3"
                        :maxlength="5"
                        placeholder="请输入内容"
                        @focus="handleFocus"
                        :modelValue="input">
                    </el-input>
                `,
          data() {
            return {
              input: 'input',
              inputFocus: false
            }
          },
          methods: {
            handleFocus() {
              this.inputFocus = true
            }
          },
          components: {
            [Input.name]: Input
          }
        },
        {
          global: globalOption
        }
      )
      const inputElm = wrapper.find('input')
      inputElm.trigger('focus')
      expect(wrapper.vm.inputFocus).toBeTruthy()
      expect(inputElm.attributes('placeholder')).toEqual('请输入内容')
      expect(inputElm.attributes('minlength')).toEqual('3')
      expect(inputElm.attributes('maxlength')).toEqual('5')
      expect(inputElm.element.value).toEqual('input')
      wrapper.vm.input = 'text'
      await nextTick()
      expect(inputElm.element.value).toEqual('text')
    })

    it('default to empty', () => {
      const wrapper = mount(Input, {
        global: globalOption
      })
      const inputElm = wrapper.find('input')
      expect(inputElm.element.value).toEqual('')
    })

    it('disabled', () => {
      const wrapper = mount(Input, {
        props: {
          disabled: true
        },
        global: globalOption
      })

      const inputElm = wrapper.find('input')
      expect(inputElm.attributes('disabled')).toEqual('')
    })

    it('suffixIcon', () => {
      const wrapper = mount(Input, {
        props: {
          suffixIcon: 'time'
        },
        global: globalOption
      })
      const icon = wrapper.find('.el-input__icon')
      expect(icon.exists()).toBeTruthy()
    })

    it('prefixIcon', () => {
      const wrapper = mount(Input, {
        props: {
          prefixIcon: 'time'
        },
        global: globalOption
      })
      const icon = wrapper.find('.el-input__icon')
      expect(icon.exists()).toBeTruthy()
    })

    it('size', () => {
      const wrapper = mount(Input, {
        props: {
          size: 'large'
        },
        global: globalOption
      })
      expect(wrapper.classes()).toContain('el-input--large')
    })

    it('type', () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea'
        },
        global: globalOption
      })
      expect(wrapper.classes()).toContain('el-textarea')
    })

    it('rows', () => {
      const wrapper = mount(Input, {
        props: {
          type: 'textarea',
          rows: 3
        },
        global: globalOption
      })
      expect(wrapper.find('.el-textarea__inner').attributes('rows')).toEqual(
        '3'
      )
    })

    // Github issue #2836
    it('resize', async () => {
      const wrapper = mount(
        {
          template: `
                <div>
                      <el-input type="textarea" :resize="resize"></el-input>
                    </div>
                `,
          data() {
            return {
              resize: 'none'
            }
          },
          components: {
            [Input.name]: Input
          }
        },
        {
          global: globalOption
        }
      )

      await nextTick()
      const textarea = wrapper.find('.el-textarea__inner')
      expect(textarea.attributes('style')).toContain(
        `resize: ${wrapper.vm.resize}`
      )
      wrapper.vm.resize = 'horizontal'
      await nextTick()
      expect(textarea.attributes('style')).toContain(
        `resize: ${wrapper.vm.resize}`
      )
    })

    // it('autosize', async () => {
    //     Object.defineProperties(window.HTMLElement.prototype, {
    //         scrollHeight: {
    //             get: function () {
    //                 console.log('get', this.style)
    //                 return parseFloat(window.getComputedStyle(this).height) || 0;
    //             }
    //         },
    //     });
    //     const wrapper = mount({
    //         template: `
    //         <div>
    //           <el-input
    //             ref="limitSize"
    //             type="textarea"
    //             :autosize="{minRows: 3, maxRows: 5}"
    //             v-model="textareaValue"
    //           >
    //           </el-input>
    //           <el-input
    //             ref="limitlessSize"
    //             type="textarea"
    //             autosize
    //             v-model="textareaValue"
    //           >
    //           </el-input>
    //         </div>
    //       `,
    //         data() {
    //             return {
    //                 textareaValue: 'sda\ndasd\nddasdsda\ndasd\nddasdsda\ndasd\nddasdsda\ndasd\nddasd'
    //             }
    //         },
    //         components: {
    //             [Input.name]: Input
    //         },
    //     }, {
    //         global: globalOption,
    //     })

    //     let limitSizeInput = wrapper.componentVM.$refs.limitSize
    //     let limitlessSizeInput = wrapper.componentVM.$refs.limitlessSize
    //     await nextTick()

    //     expect(limitSizeInput.textareaStyle.height).toEqual('117px')
    //     expect(limitlessSizeInput.textareaStyle.height).toEqual('201px')

    //     vm.textareaValue = ''

    //     await nextTick()
    //     expect(limitSizeInput.textareaStyle.height).to.be.equal('75px')
    //     expect(limitlessSizeInput.textareaStyle.height).to.be.equal('33px')
    // })
  })

  describe('events', () => {
    // it('focus', async () => {
    //     const wrapper = mount(Input, {
    //         global: globalOption
    //     })
    //     wrapper.trigger('focus')
    //     await nextTick()
    //     expect(wrapper.vm.focused).toBeTruthy()
    // })
    // it('Input contains Select and append slot', async () => {
    //     const wrapper = mount({
    //         template: `
    //       <el-input v-model="value" clearable class="input-with-select" ref="input">
    //         <el-select v-model="select" slot="prepend" placeholder="请选择">
    //           <el-option label="餐厅名" value="1"></el-option>
    //           <el-option label="订单号" value="2"></el-option>
    //           <el-option label="用户电话" value="3"></el-option>
    //         </el-select>
    //         <el-button slot="append" icon="el-icon-search"></el-button>
    //       </el-input>
    //       `,
    //         data() {
    //             return {
    //                 value: '1234',
    //                 select: '1'
    //             }
    //         },
    //         components: {
    //             [Input.name]: Input
    //         },
    //     }, {
    //         global: globalOption
    //     })
    //     wrapper.componentVM.$refs.input.hovering = true
    //     await nextTick()
    //     const suffixEl = document.querySelector('.input-with-select > .el-input__suffix')
    //     expect(suffixEl).toBeNull()
    //     expect(suffixEl.style.transform).to.not.be.empty
    // })
    // it('limit input and show word count', async () => {
    //     const wrapper = mount({
    //         template: `
    //         <div>
    //           <el-input
    //             class="test-text"
    //             type="text"
    //             v-model="input1"
    //             maxlength="10"
    //             :show-word-limit="show">
    //           </el-input>
    //           <el-input
    //             class="test-textarea"
    //             type="textarea"
    //             v-model="input2"
    //             maxlength="10"
    //             show-word-limit>
    //           </el-input>
    //           <el-input
    //             class="test-password"
    //             type="password"
    //             v-model="input3"
    //             maxlength="10"
    //             show-word-limit>
    //           </el-input>
    //           <el-input
    //             class="test-initial-exceed"
    //             type="text"
    //             v-model="input4"
    //             maxlength="2"
    //             show-word-limit>
    //           </el-input>
    //         </div>
    //       `,
    //         data() {
    //             return {
    //                 input1: '',
    //                 input2: '',
    //                 input3: '',
    //                 input4: 'exceed',
    //                 show: false
    //             }
    //         },
    //         components: {
    //             [Input.name]: Input
    //         },
    //     }, {
    //         global: globalOption
    //     })
    //     const inputElm1 = wrapper.find('.test-text')
    //     const inputElm2 = wrapper.find('.test-textarea')
    //     const inputElm3 = wrapper.find('.test-password')
    //     const inputElm4 = wrapper.find('.test-initial-exceed')
    //     await nextTick()
    //     expect(inputElm1.findAll('.el-input__count').length).toEqual(0)
    //     // expect(inputElm2.findAll('.el-input__count').length).toEqual(1)
    //     expect(inputElm3.findAll('.el-input__count').length).toEqual(0)
    //     expect(inputElm4.classes()).toContain('is-exceed')
    //     vm.show = true
    //     await nextTick()
    //     expect(inputElm1.findAll('.el-input__count').length).toEqual(0)
    //     vm.input4 = '1'
    //     await nextTick()
    //     expect(inputElm4.classes()).toContain('is-exceed')
    // })
  })
})
