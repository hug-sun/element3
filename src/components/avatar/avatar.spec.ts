import Avatar from './Avatar.vue'
import { mount } from '@vue/test-utils'

describe('Avatar.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('content', () => {
    const vm = mount(Avatar, {
      slots: {
        default: () => 'Im perfect avatar!'
      }
    })

    expect(vm.text()).toBe('Im perfect avatar!')
  })

  it('direction', () => {
    const vm = mount(Avatar, {
      props: { direction: 'vertical' }
    })

    expect(vm.classes()).toContain('el-avatar--vertical')
  })

  it('contentPosition', () => {
    const vm = mount(Avatar, {
      props: { 'content-position': 'left' },
      slots: {
        default: () => {
          return 'some text'
        }
      }
    })
    const text = vm.find('.el-avatar__text')
    expect(text).toBeDefined()
    expect(text.classes()).toContain('is-left')
  })

  it('apply class to avatar', () => {
    const vm = mount(Avatar, {
      attrs: {
        class: 'my-avatar'
      }
    })

    expect(vm.classes()).toContain('my-avatar')
  })
})
