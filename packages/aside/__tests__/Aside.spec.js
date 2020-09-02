import Aside from '../Aside.vue'
import { mount } from '@vue/test-utils'
describe('Aside.vue', () => {
  describe('style', () => {
    it('text', () => {
      const wrapper = mount(Aside, {
        props: {
          width: '200px'
        }
      })
      expect(wrapper.attributes().style).toBe('width: 200px;')
    })
  })
  describe('slot', () => {
    it('text', () => {
      const wrapper = mount(Aside, {
        slots: {
          default: () => 'hello'
        }
      })
      expect(wrapper.text()).toBe('hello')
    })
  })
})
