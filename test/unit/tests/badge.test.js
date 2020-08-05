import Badge from '../../../packages/badge/src/main.vue'
import { mount } from '@vue/test-utils'
import '@testing-library/jest-dom'
describe('Badge', () => {
  describe('props', () => {
    it('isDot', () => {
      const wrapper = mount(Badge, {
        props: {
          isDot: true
        }
      })

      expect(wrapper.find('.el-badge__content').classes()).toContain('is-dot')
    })

    it('hidden', ()=>{
      const wrapper = mount(Badge, {
        props: {
          hidden: true,
          isDot: true
        }
      })

      expect(wrapper.find('.el-badge__content').element).not.toBeVisible()
    })

    it('type', ()=>{
      const wrapper = mount(Badge, {
        props: {
          type: 'success'
        }
      })

      expect(wrapper.find('.el-badge__content').classes()).toContain('el-badge__content--success')
    })
  })
})
