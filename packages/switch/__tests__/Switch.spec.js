import Switch from '../Switch.vue'
import { mount } from '@vue/test-utils'
describe('Switch', () => {
  describe('props', () => {
    it('should is-checked when set modelValue to true', async() => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: true,
          activeColor: '#13ce66',
          inactiveColor: '#ff4949'
        }
      })

      expect(wrapper.classes()).toContain('is-checked')
    })
    it('should show left label when set inactiveIconClass', () => {
      const wrapper = mount(Switch, {
        props: {
          inactiveIconClass: 'el-icon-close'
        }
      })

      const labelLeftElement = wrapper.find('.el-switch__label--left')
      expect(labelLeftElement.exists()).toBe(true)
      expect(labelLeftElement.find('i').classes()).toContain('el-icon-close')
    })

    it('should show right label when set activeIconClass', () => {
      const wrapper = mount(Switch, {
        props: {
          activeIconClass: 'el-icon-check'
        }
      })

      const labelLeftElement = wrapper.find('.el-switch__label--right')
      expect(labelLeftElement.exists()).toBe(true)
      expect(labelLeftElement.find('i').classes()).toContain('el-icon-check')
    })

    it('should show text on the right label when set activeText', () => {
      const wrapper = mount(Switch, {
        props: {
          activeText: 'on'
        }
      })

      const labelLeftElement = wrapper.find('.el-switch__label--right')
      expect(labelLeftElement.find('span').text()).toBe('on')
    })

    it('should show text on the left label when set inactiveText', () => {
      const wrapper = mount(Switch, {
        props: {
          inactiveText: 'off'
        }
      })

      const labelLeftElement = wrapper.find('.el-switch__label--left')
      expect(labelLeftElement.find('span').text()).toBe('off')
    })

    it('should not click when set disabled to true', () => {
      const wrapper = mount(Switch, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    it('width', () => {
      const wrapper = mount(Switch, {
        props: {
          width: 50
        }
      })

      expect(wrapper.find('.el-switch__core').attributes('style')).toContain(
        'width: 50px'
      )
    })

    it('name', () => {
      const wrapper = mount(Switch, {
        props: {
          name: 'switchTest'
        }
      })

      expect(wrapper.find('.el-switch__input').attributes('name')).toBe(
        'switchTest'
      )
    })

    describe('should emitted update:modelValue when created ', () => {
      it('The value of modelValue is not equal to the value of activeValue', () => {
        const wrapper = mount(Switch, {
          props: {
            activeValue: '1',
            inactiveValue: false,
            modelValue: '3'
          }
        })

        expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
      })

      it('The value of modelValue is not equal to the value of inactiveValue', () => {
        const wrapper = mount(Switch, {
          props: {
            inactiveValue: '2',
            modelValue: '3'
          }
        })

        expect(wrapper.emitted('update:modelValue')).toEqual([['2']])
      })
    })

    it.skip('activeColor', () => {
      // todo
      // activeColor 代码实现中的方式不可测试
      // 重构完在测试
      const wrapper = mount(Switch, {
        activeColor: '0xff0000'
      })

      expect(wrapper.find('.el-switch__core').attributes('style')).toContain(
        'borderColor'
      )
    })

    it.skip('inactiveColor', () => {
      // todo
      // inactiveColor 代码实现中的方式不可测试
      // 重构完在测试
      const wrapper = mount(Switch, {
        activeColor: '0xff0000'
      })

      expect(wrapper.find('.el-switch__core').attributes('style')).toContain(
        'borderColor'
      )
    })
  })
})
