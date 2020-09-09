import TabPane from '../tab-pane.vue'
import { mount } from '@vue/test-utils'
describe('tab-pane.vue', () => {
  describe('name', () => {

    it('slot', () => {
      const wrapper = mount(TabPane, {
        slots: {
          default: '用户管理'
        }
      })

      expect(wrapper.find('.el-tab-pane').text()).toBe('用户管理')
    })
  })

})
