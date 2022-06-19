import { mount } from '@vue/test-utils'
import Divider from '../Divider.vue'

describe('Divider.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Divider)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('content', () => {
    const vm = mount(Divider, {
      slots: {
        default: () => 'Im perfect divider!',
      },
    })

    expect(vm.text()).toBe('Im perfect divider!')
  })

  it('direction', () => {
    const vm = mount(Divider, {
      props: { direction: 'vertical' },
    })

    expect(vm.classes()).toContain('el-divider--vertical')
  })

  it('contentPosition', () => {
    const vm = mount(Divider, {
      props: { 'content-position': 'left' },
      slots: {
        default: () => {
          return 'some text'
        },
      },
    })
    const text = vm.find('.el-divider__text')

    expect(text).toBeDefined()
    expect(text.classes()).toContain('is-left')
  })

  it('dividerStyle', () => {
    const vm = mount(Divider, {
      props: { dividerStyle : 'double' }
    })

    expect(vm.classes()).toContain(`is-double`)
  })

  it('color', () => {
    const vm = mount(Divider, {
      props: { color: 'rgb(23, 45, 52)' }
    })

    expect(vm.attributes('style')).toBe('color: rgb(23, 45, 52);')
  })

  it('dark', async () => {
    const vm = mount(Divider, {
      slots: {
        default: 'Divider'
      },
      props: { dark: true }
    })

    expect(vm.find('.el-divider__text').classes()).toContain('is-dark')

    await vm.setProps({
       dark: false
    })

    expect(vm.find('.el-divider__text').classes()).not.toContain('is-dark')
  })

  it('apply class to divider', () => {
    const vm = mount(Divider, {
      attrs: {
        class: 'my-divider',
      },
    })

    expect(vm.classes()).toContain('my-divider')
  })

})
