import Badge from '../src/Badge.vue'
import { mount } from '@vue/test-utils'

describe('Badge', () => {
  it('snapshot', () => {
    const wrapper = mount(Badge)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('props', () => {
    it('should render props.value', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('13')
    })

    it('should render props.value when value lt max', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13,
          max: 20
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('13')
    })

    it('should render string props.value', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 'new~'
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('new~')
    })

    it('should not render when props.value eq 0', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 0
        }
      })

      expect(wrapper.find('.el-badge__content').exists()).toBeFalsy()
    })

    it('should  render solt', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 0
        },
        slots: {
          default() {
            return 'default slot'
          }
        }
      })

      expect(wrapper.find('.el-badge').text()).toContain('default slot')
    })

    it('should render `+` over max value', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13,
          max: 10
        }
      })

      expect(wrapper.find('.el-badge__content').text()).toContain('10+')
    })

    it('should render dot', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13,
          max: 10,
          isDot: true
        }
      })

      expect(wrapper.find('.is-dot').text()).toBeTruthy()
    })

    it('should not render when hidden', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13,
          max: 10,
          hidden: true
        }
      })

      expect(wrapper.find('sup').exists()).toBeFalsy()
    })

    it('should  render props.type', () => {
      const wrapper = mount(Badge, {
        props: {
          value: 13,
          max: 10,
          type: 'primary'
        }
      })

      expect(wrapper.find('sup').classes()).toContain(
        'el-badge__content--primary'
      )
    })
  })
})
