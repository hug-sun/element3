import Divider from '../src/Divider.vue'
import { mount } from '@vue/test-utils'

describe('Divider.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Divider)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('content', () => {
    const vm = mount(Divider, {
      slots: {
        default: () => 'Im perfect divider!'
      }
    })

    expect(vm.text()).toBe('Im perfect divider!')
  })

  it('direction', () => {
    const vm = mount(Divider, {
      props: { direction: 'vertical' }
    })

    expect(vm.classes()).toContain('el-divider--vertical')
  })

  it('contentPosition', () => {
    const vm = mount(Divider, {
      props: { 'content-position': 'left' },
      slots: {
        default: () => {
          return 'some text'
        }
      }
    })
    const text = vm.find('.el-divider__text')
    expect(text).toBeDefined()
    expect(text.classes()).toContain('is-left')
  })

  it('apply class to divider', () => {
    const vm = mount(Divider, {
      attrs: {
        class: 'my-divider'
      }
    })

    expect(vm.classes()).toContain('my-divider')
  })
})
