import Divider from '../Divider.vue'
import { mount } from '@vue/test-utils'

describe('Divider.vue', () => {
  it('content', () => {
    const vm = mount(Divider, {
      slots: {
        default: () => '我是一条完美分割线！'
      }
    })

    expect(vm.text()).toBe('我是一条完美分割线！')
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
