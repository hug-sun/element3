import InputNumber from '../input-number.vue'
import { mount } from '@vue/test-utils'

// ! todo
// 实现的功能
// step:Number 计数器步长
// stepStrictly: Boolean 是否只能输入 step 的倍数
// max: Number,
// min: Number,
// value: {},
// name: String,原生属性
// label: String,
// placeholder: String,
// precision: Number 数值精度

describe('InputNumber', () => {
  describe('props', () => {
    // size: String, 计数器尺寸
    it('size', () => {
      const wrapper = mount(InputNumber, {
        props: {
          size: 'small' // large
        }
      })
      // el-input-number--
      expect(wrapper.find('.el-input-number').classes()).toContain(
        'el-input-number--small'
      )
    })

    // disabled: Boolean,是否禁用计数器
    it('disabled', () => {
      const wrapper = mount(InputNumber, {
        props: {
          disabled: true
        }
      })
      expect(wrapper.find('.el-input-number').classes()).toContain(
        'is-disabled'
      )
    })

    // controls: Boolean是否使用控制按钮
    it('controls', () => {
      const wrapper = mount(InputNumber, {
        props: {
          controls: false
        }
      })
      expect(wrapper.find('.el-input-number').classes()).toContain(
        'is-without-controls'
      )
    })

    // controlsPosition: String,控制按钮位置
    it('controlsPosition', () => {
      const wrapper = mount(InputNumber, {
        props: {
          controlsPosition: 'right'
        }
      })
      expect(wrapper.find('.el-input-number').classes()).toContain(
        'is-controls-right'
      )
    })
  })
})
