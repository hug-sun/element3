import PageHeader from '../src/main.vue'
import { mount } from '@vue/test-utils'

describe('PageHeader', () => {
  it('prop', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'title',
        content: 'content'
      }
    })
    expect(wrapper.find('.el-page-header__title').text()).toContain('title')
    expect(wrapper.find('.el-page-header__content').text()).toContain('content')
  })

  it('should emit back event ', () => {
    const wrapper = mount(PageHeader)

    wrapper.find('.el-page-header__left').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })
})
