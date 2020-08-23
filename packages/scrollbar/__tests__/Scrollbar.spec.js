import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Scrollbar from '../Scrollbar'

describe('Scrollbar', () => {
  describe('props', () => {
    it('tag', () => {
      const wrapper = mount(Scrollbar, {
        props: {
          tag: 'ul'
        },
        slots: {
          default: [1, 2, 3].map((item) => h('li', item))
        }
      })
      expect(
        wrapper.find('.el-scrollbar__view').element instanceof HTMLUListElement
      ).toBeTruthy()
    })
    it('wrap-class', () => {
      const wrapper = mount(Scrollbar, {
        props: {
          wrapClass: 'test-class'
        },
        slots: {
          default: [1, 2, 3].map((item) => h('li', item))
        }
      })
      expect(
        wrapper.find('.test-class.el-scrollbar__wrap').exists()
      ).toBeTruthy()
    })
  })
})
