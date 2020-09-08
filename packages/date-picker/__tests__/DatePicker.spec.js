import DatePicker from '../src/picker/date-picker'
import { mount } from '@vue/test-utils'

const globalOption = {
  config: {
    globalProperties: {
      $ELEMENT: {
        size: ''
      }
    }
  }
}

describe('DatePicker', () => {
  describe('props', () => {
    it('create ', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          readonly: true,
          placeholder: '选择日期',
          format: 'HH-mm-ss'
        },
        global: globalOption
      })
      const inputElm = wrapper.find('input')
      // 设置readonly 应该为 readonly='readonly' 但是生成的html是 readonly=''
      expect(inputElm.attributes('readonly')).toBe('')
      expect(inputElm.attributes('placeholder')).toBe('选择日期')
    })

    // TODO: mountPicker => panel 挂载有问题未解决
    // it('select date', async (done) => {
    //   const date = new Date()
    //   const wrapper = mount(DatePicker, {
    //     props: {
    //       value: ''
    //     },
    //     global: globalOption
    //   })

    //   const inputElm = wrapper.find('input')
    //   inputElm.trigger('blur')
    //   inputElm.trigger('focus')
    // })
  })
})
