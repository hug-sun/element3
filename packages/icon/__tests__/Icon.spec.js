import Icon from '../Icon.vue'
import { mount } from '@vue/test-utils'
describe('Icon.vue', () => {
  describe('icon', () => {
    it('loading', () => {
      const wrapper = mount(Icon, {
        props: {
          name: 'loading'
        }
      })
      expect(wrapper.classes()).toContain('el-icon-loading')
    })
  })
})
