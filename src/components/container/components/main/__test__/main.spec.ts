import { mount } from '@vue/test-utils'
import Main from '../Main.vue'
describe('Main.vue', () => {
  it('Main snapshot', () => {
    const wrapper = mount(Main)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('Main render', () => {
    const wrapper = mount(Main)
    expect(wrapper.classes()).toContain('el-main')
  })
  it('Main slot', () => {
    const wrapper = mount(Main, {
      slots: {
        default: () => 'hello world',
      },
    })
    expect(wrapper.text()).toBe('hello world')
  })
})

