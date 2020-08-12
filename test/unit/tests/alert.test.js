import Alert from '../../../packages/alert/src/main.vue'
import { mount } from '@vue/test-utils'
describe('Alert.vue', () => {
  describe('props', () => {
    it('title', () => {
      const wrapper = mount(Alert, {
        props: {
          title: 'test title'
        }
      })
      const wrapper_slot = mount(Alert, {
        slots: {
          title: () => {
            return 'title slot'
          }
        }
      })

      expect(wrapper.find('span').text()).toBe('test title')
      expect(wrapper_slot.find('span').text()).toBe('title slot')
    })

    it('description', () => {
      const wrapper = mount(Alert, {
        props: {
          description: 'test description'
        }
      })
      const wrapper_slot = mount(Alert, {
        slots: {
          default: () => {
            return 'description slot'
          }
        }
      })

      expect(wrapper.find('.el-alert__description').text()).toBe('test description')
      expect(wrapper_slot.find('.el-alert__description').text()).toBe('description slot')

    })

    it('type', () => {
      const wrapper_info = mount(Alert, {
        props: {
          type: 'info'
        }
      })
      const wrapper_success = mount(Alert, {
        props: {
          type: 'success'
        }
      })
      const wrapper_warning = mount(Alert, {
        props: {
          type: 'warning'
        }
      })
      const wrapper_error = mount(Alert, {
        props: {
          type: 'error'
        }
      })

      expect(wrapper_info.classes()).toContain('el-alert--info')
      expect(wrapper_success.classes()).toContain('el-alert--success')
      expect(wrapper_warning.classes()).toContain('el-alert--warning')
      expect(wrapper_error.classes()).toContain('el-alert--error')
    })

    it('closable', () => {
      const wrapper_true = mount(Alert, {
        props: {
          closable: true
        }
      })
      const wrapper_trueWithText = mount(Alert, {
        props: {
          closable: true,
          closeText: '知道了'
        }
      })
      const wrapper_false = mount(Alert, {
        props: {
          closable: false
        }
      })

      expect(wrapper_true.find('.el-alert__closebtn').attributes('style')).toBe(undefined)
      expect(wrapper_trueWithText.find('.el-alert__closebtn').text()).toContain('知道了')
      expect(wrapper_false.find('.el-alert__closebtn').attributes('style')).toBe('display: none;')
    })

    it('showIcon', () => {
      const wrapper_true = mount(Alert, {
        props: {
          showIcon: true
        }
      })
      const wrapper_false = mount(Alert, {
        props: {
          showIcon: false
        }
      })

      expect(wrapper_true.find('.el-alert__icon').exists()).toBe(true)
      expect(wrapper_false.find('.el-alert__icon').exists()).toBe(false)
    })

    it('center', () => {
      const wrapper_true = mount(Alert, {
        props: {
          center: true
        }
      })
      const wrapper_false = mount(Alert, {
        props: {
          center: false
        }
      })

      expect(wrapper_true.classes('is-center')).toBe(true)
      expect(wrapper_false.classes('is-center')).toBe(false)
    })

    it('effect', () => {
      const wrapper_light = mount(Alert, {
        props: {
          effect: 'light'
        }
      })
      const wrapper_dark = mount(Alert, {
        props: {
          effect: 'dark'
        }
      })

      expect(wrapper_light.classes('is-light')).toBe(true)
      expect(wrapper_dark.classes('is-dark')).toBe(true)
    })
  })

  describe('event', () => {
    it('close', () => {
      const wrapper = mount(Alert)
      wrapper.find('.el-alert__closebtn').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })
})
