import { mount } from '@vue/test-utils'
import Header from '../Header'

describe('Header.vue', () => {
  test('Header 渲染', () => {
    const wrapper = mount(Header)
    expect(wrapper.classes()).toContain('el-header')
  })

  test('Header 高度', () => {
    const wrapper = mount(Header, {
      props: {
        height: '100px'
      }
    })
    const vm = wrapper.vm
    expect(vm.$el.style.height).toEqual('100px')
  })
})
