import Badge from '../Badge.vue'
import { mount } from '@vue/test-utils'

describe('Badge', () => {
  describe('props', () => {
    it('value', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('13')
    })

    it('max', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 99,
          max: 13
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('13')
    })

    it('isDot', () => {
      const wrapper = mount(Badge, {
        props: {
          isDot: true
        }
      })

      expect(wrapper.find('.el-badge__content').classes()).toContain('is-dot')
    })

    it('hidden', () => {
      const wrapper = mount(Badge, {
        props: {
          hidden: true,
          isDot: true
        }
      })

      expect(wrapper.find('.el-badge__content').element).not.toBeVisible()
    })

    it('type', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 12,
          type: 'success'
        }
      })

      expect(wrapper.find('.el-badge__content').classes()).toContain(
        'el-badge__content--success'
      )
    })
  })
})
