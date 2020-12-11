import { mount } from '@vue/test-utils'
import Header from '../Header'

describe('Header.vue', () => {
  it('Header 渲染', () => {
    const wrapper = mount(Header)
    expect(wrapper.classes()).toContain('el-header')
  })

  it('Header default height equals 60px', () => {
    const wrapper = mount(Header)

    expect(wrapper.find('.el-header').attributes().style).toBe('height: 60px;')
  })

  it('Header 设置高度', () => {
    const wrapper = mount(Header, {
      props: {
        height: '100px'
      }
    })
    const vm = wrapper.vm
    expect(vm.$el.style.height).toEqual('100px')
  })
})
