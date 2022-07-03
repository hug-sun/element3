import { mount } from '@vue/test-utils'
import Footer from '../Footer.vue'
describe('Footer.vue', () => {
  it('Footer snapshot', () => {
    const wrapper = mount(Footer)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('Footer render', () => {
    const wrapper = mount(Footer)
    expect(wrapper.classes()).toContain('el-footer')
  })
  it('Footer slot', () => {
    const wrapper = mount(Footer, {
      slots: {
        default: () => 'hello world',
      },
    })
    expect(wrapper.text()).toBe('hello world')
  })
  it('Footer style', () => {
    const wrapper = mount(Footer, {
      props: {
        height: '90px',
      },
    })
    const height = wrapper.vm.$el.style.height
    expect(height).toBe('90px')
  })
})

