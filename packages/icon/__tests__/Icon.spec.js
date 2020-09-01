import Icon from '../Icon.vue'
import { mount } from '@vue/test-utils'
describe('Icon.vue', () => {
  describe('class', () => {
    it('phone', () => {
      const wrapper = mount(Icon, {
        props: {
          name: 'phone'
        }
      })
      expect(wrapper.classes()[0]).toBe('el-icon-phone')
    })
  })
})
