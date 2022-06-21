import { mount } from '@vue/test-utils'
import Header from '../Header.vue'
describe('Header.vue', () => {
  it('Header snapshot', () => {
    const wrapper = mount(Header)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('Header render', () => {
    const wrapper = mount(Header)
    expect(wrapper.classes()).toContain('el-header')
  })
  it('Header slot', () => {
    const wrapper = mount(Header, {
      slots: {
        default: () => 'hello world',
      },
    })
    expect(wrapper.text()).toBe('hello world')
  })
  it('Header style', () => {
    const wrapper = mount(Header, {
      props: {
        height: '90px',
      },
    })
    expect(wrapper.attributes('style')).toBe('height: 90px;')
  })
})

