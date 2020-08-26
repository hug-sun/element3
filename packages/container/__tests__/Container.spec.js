import Container from '../Container.vue'
import { mount } from '@vue/test-utils'
describe('Container.vue', () => {
  describe('is-vertical', () => {
    it('is-vertical', () => {
      const wrapper = mount(Container, {
        props: {
          direction: 'vertical' || 'horizontal' || ''
        }
      })
      expect(wrapper.classes()).toContain('el-container')
    })
  })
})
