import ButtonGroup from '../ButtonGroup'
import { mount } from '@vue/test-utils'

describe('ButtonGroup.vue', () => {
  describe('slot', () => {
    it('slot', () => {
      const wrapper = mount(ButtonGroup, {
        slots: {
          default: 'Solt'
        }
      })
      expect(wrapper.find('.el-button-group').text()).toBe('Solt')
    })
  })
})
