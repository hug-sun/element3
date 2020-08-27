import PageHeader from '../src/main'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

describe('PageHeader.vue', () => {
  describe('props', () => {
    it('content', async () => {
      const content = ref('详情页面')
      const wrapper = mount(PageHeader, {
        props: {
          content
        }
      })

      expect(wrapper.props('content')).toBe('详情页面')
    })
    it('title', async () => {
      const title = ref('返回')
      const wrapper = mount(PageHeader, {
        props: {
          title
        }
      })

      expect(wrapper.props('title')).toBe('返回')
    })
  })

  describe('event', () => {
    it('back', async () => {
      const title = ref('返回')
      const wrapper = mount(PageHeader, {
        props: {
          title
        }
      })

      await nextTick()
      await wrapper.find('.el-page-header__left').trigger('click')
      await nextTick()
      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })
})
