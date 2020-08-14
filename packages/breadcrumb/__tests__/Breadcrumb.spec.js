import BreadcrumbItem from '../../breadcrumb-item/BreadcrumbItem.vue'
import { mount } from '@vue/test-utils'

describe('Breadcrumb.vue', () => {
  describe('props', () => {
    it('separator', () => {
      const wrapper = mount(BreadcrumbItem, {
        porps: {
          separator: '/'
        }
      })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.el-breadcrumb__separator').text()).toContain('/')
      })
    })

    it('separatorClass', () => {
      const wrapper = mount(BreadcrumbItem, {
        porps: {
          separatorClass: '>'
        }
      })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.el-breadcrumb__separator').text()).toContain('>')
      })
    })
  })
})
