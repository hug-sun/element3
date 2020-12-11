import PageHeader from '../PageHeader.vue'
import { mount } from '@vue/test-utils'

describe('PageHeader', () => {
  it('Slots', () => {
    const wrapper = mount(PageHeader, {
      slots: {
        title: () => {
          return 'title slot'
        },
        content: () => {
          return 'content slot'
        }
      }
    })
    expect(wrapper.find('.el-page-header__title').text()).toContain('title')
    expect(wrapper.find('.el-page-header__content').text()).toContain('content')
  })

  it('Attributes', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'title',
        content: 'content'
      }
    })
    expect(wrapper.find('.el-page-header__title').text()).toContain('title')
    expect(wrapper.find('.el-page-header__content').text()).toContain('content')
  })

  it('Events:should emit back event', () => {
    const wrapper = mount(PageHeader)

    wrapper.find('.el-page-header__left').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })
})
