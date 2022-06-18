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
  it('size', () => {
    const vm = mount(Avatar, {
      props: { size: 'small' }
    })
    expect(vm.classes).contain('el-avatar-small')
  })
  it('shape', () => {
    const vm = mount(Avatar, {
      props: { shape: 'square' }
    })
    expect(vm.classes).contain('el-avatar-small')
  })
  it('fit', () => {
    
  })
  it('last of props')
})
