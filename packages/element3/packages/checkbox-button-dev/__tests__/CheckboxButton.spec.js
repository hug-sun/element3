import ElCheckboxButton from '../index'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { setupGlobalOptions } from '../../../src'
import Checkbox from '../../checkbox-dev/Checkbox'

describe('ElCheckboxButton', function () {
  test('default slot', () => {
    const text = 'apples'
    const wrapper = mount(ElCheckboxButton, {
      slots: {
        default: text
      }
    })

    expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(text)
  })

  describe('label', () => {
    test('props.label', () => {
      const label = 'orange'
      const wrapper = mount(ElCheckboxButton, {
        props: {
          label
        }
      })

      expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(label)
    })

    test('set label and slot as the same time', () => {
      const text = 'apples'
      const label = 'orange'
      const wrapper = mount(ElCheckboxButton, {
        props: { label },
        slots: {
          default: text
        }
      })

      expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(text)
    })

    test('label and slot do not exist at the same time', () => {
      const wrapper = mount(ElCheckboxButton)

      expect(wrapper.classes()).not.toContain('el-checkbox-button__inner')
    })
  })

  describe('size', () => {
    test('props.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        props: { size }
      })

      await wrapper.setProps({ size })
      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by elCheckboxGroup.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elCheckboxGroup: reactive({ proxy: { size } }) }
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by elFormItem.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elFormItem: reactive({ size }) }
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by global config', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          plugins: [setupGlobalOptions({ size })]
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })
  })

  describe('disabled', () => {
    test('props.disabled', async () => {
      const wrapper = mount(ElCheckboxButton)
      expect(wrapper.classes()).not.toContain('is-disabled')
      await wrapper.setProps({ disabled: true })
      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elCheckboxGroup.disabled', () => {
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elCheckboxGroup: reactive({ proxy: { disabled: true } }) }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elFormItem.disabled', () => {
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elFormItem: reactive({ disabled: true }) }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })
  })

  test('name', async () => {
    const name = 'ElCheckboxButton'
    const wrapper = mount(ElCheckboxButton)
    await wrapper.setProps({ name })

    expect(wrapper.get('input').attributes('name')).toBe(name)
  })

  test('true-label', () => {})
})
