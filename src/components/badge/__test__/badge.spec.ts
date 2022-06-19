import { mount } from '@vue/test-utils'
import Badge from '../Badge.vue'

describe('Badge.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Badge)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render props.value', () => {
    const vm = mount(Badge, {
      props: {
        value: 7,
      },
    })

    expect(vm.find('.el-badge__content').text()).toBe('7')
  })

  it('should render string props.value', () => {
    const vm = mount(Badge, {
      props: {
        value: 'Badge',
      },
    })

    expect(vm.find('.el-badge__content').text()).toBe('Badge')
  })

  it('should render props.value when value larger then max', () => {
    const vm = mount(Badge, {
      props: {
        value: 100,
        max: 10,
      },
    })

    expect(vm.find('.el-badge__content').text()).toBe('10+')
  })

  it('should render props.value when value less then max', () => {
    const vm = mount(Badge, {
      props: {
        value: 9,
        max: 10,
      },
    })

    expect(vm.find('.el-badge__content').text()).toBe('9')
  })

  it('should render dot', () => {
    const vm = mount(Badge, {
      props: {
        value: 7,
        max: 10,
        isDot: true,
      },
    })

    const text = vm.find('.el-badge__content')
    expect(text.classes()).toContain('is-dot')
  })

  it('should not render when set hidden', () => {
    const vm = mount(Badge, {
      props: {
        value: 7,
        max: 10,
        hidden: true,
      },
    })

    expect(vm.find('sup').exists()).toBeFalsy()
  })

  it('should render props.type', () => {
    const vm = mount(Badge, {
      props: {
        value: 7,
        type: 'primary',
      },
    })

    const text = vm.find('.el-badge__content')
    expect(text.classes()).toContain('el-badge__content--primary')
  })
})
