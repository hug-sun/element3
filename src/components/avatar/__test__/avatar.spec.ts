import { mount } from '@vue/test-utils'
import Avatar from '../Avatar.vue'
import { ElIcon } from '../../icon'

describe('Avatar.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Avatar, {
      props: { icon: 'user-solid' },
    })
    expect(wrapper.find('.el-avatar').exists()).toBe(true)
  })
  it('content', () => {
    const vm = mount(Avatar, {
      slots: {
        default: () => 'Im perfect avatar!',
      },
    })
    expect(vm.text()).toBe('Im perfect avatar!')
  })
  it('size', () => {
    const vm = mount(Avatar, {
      props: { icon: 'user-solid', size: 'large' },
    })
    expect(vm.classes()).toContain('el-avatar--large')
  })
  it('shape', () => {
    const vm = mount(Avatar, {
      props: { icon: 'user-solid', shape: 'square' },
    })
    expect(vm.classes()).toContain('el-avatar--square')
  })
  it('fit', () => {
    const url = 'https://cdn.jsdelivr.net/gh/shengxinjing/static/element3.png'
    const vm = mount(Avatar, {
      props: { src: url, fit: 'none' },
    })
    expect(vm.find('img').attributes('style')).toContain('object-fit: none;')
  })
  it('icon', () => {
    const vm = mount(Avatar, {
      props: { icon: 'user-solid' },
    })
    expect(vm.classes()).toContain('el-avatar--icon')
    expect(vm.findComponent(ElIcon).exists()).toBe(true)
  })
})
