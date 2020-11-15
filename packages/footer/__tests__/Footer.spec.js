import { mount } from '@vue/test-utils'
import Footer from '../Footer'

describe('Footer.vue', () => {
  test('Footer 渲染', () => {
    const wrapper = mount(Footer)
    expect(wrapper.classes()).toContain('el-footer')
  })

  test('Footer 高度', () => {
    const wrapper = mount(Footer, {
      props: {
        height: '100px'
      }
    })
    const vm = wrapper.vm
    expect(vm.$el.style.height).toEqual('100px')
  })
})
