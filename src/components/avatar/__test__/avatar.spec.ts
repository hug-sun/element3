import { mount } from '@vue/test-utils'
import Avatar from '../Avatar.vue'
// import { ElIcon } from '../../icon'

describe('Avatar.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.find('.el-avatar').exists()).toBe(true)
  })

  it('text', () => {
    const vm = mount(Avatar, {
      slots: {
        default: () => 'Im perfect avatar!',
      },
    })
    expect(vm.text()).toBe('Im perfect avatar!')
  })

  it('size', () => {
    const vm = mount(Avatar, {
      props: { size: 'large' },
    })
    expect(vm.classes()).toContain('el-avatar--large')
  })

  it('shape', () => {
    const vm = mount(Avatar, {
      props: { shape: 'square' },
    })
    expect(vm.classes()).toContain('el-avatar--square')
  })

  it('fit', () => {
    const url = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    const vm = mount(Avatar, {
      props: { src: url, fit: 'fill' },
    })
    expect(vm.find('img').attributes('style')).toContain('object-fit: fill;')
  })

  it('icon', () => {
    const vm = mount(Avatar)
    expect(vm.find('i').classes()).toContain('el-icon-user')
    expect(vm.find('i').exists()).toBe(true)
  })
})
