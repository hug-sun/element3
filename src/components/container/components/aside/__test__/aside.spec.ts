import { mount } from '@vue/test-utils'
import Aside from '../Aside.vue'
describe('Aside.vue', () => {
  it('Aside snapshot', () => {
    const wrapper = mount(Aside)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('Aside render', () => {
    const wrapper = mount(Aside)
    expect(wrapper.classes()).toContain('el-aside')
  })
  it('Aside slot', () => {
    const wrapper = mount(Aside, {
      slots: {
        default: () => 'hello world',
      },
    })
    expect(wrapper.text()).toBe('hello world')
  })
  it('Aside style', () => {
    const wrapper = mount(Aside, {
      props: {
        width: '250px',
      },
    })
    expect(wrapper.attributes().style).toBe('width: 250px;')
  })
})

