import Checkbox from '../Checkbox'
import { mount } from '@vue/test-utils'
import { ref, reactive, nextTick } from 'vue'
import { setupGlobalOptions } from '../../../src/use/globalConfig'

describe('Checkbox.vue', () => {
  test('default slot', () => {
    const content = 'an apple'
    const wrapper = mount(Checkbox, {
      slots: { default: content }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe(content)
  })

  test('label', () => {
    const label = 'two apples'
    const wrapper = mount(Checkbox, {
      props: { label }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe(label)
  })

  test('slot and label priority', () => {
    const content = 'an apple'
    const label = 'twp apples'
    const wrapper = mount(Checkbox, {
      slots: { default: content },
      props: { label }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe(content)
  })

  test('no label and default slot', () => {
    const wrapper = mount(Checkbox, {
      modelValue: ref(true)
    })

    expect(wrapper.find('.el-checkbox__label').exists()).toBe(false)
  })

  test('update:modelValue', async () => {
    const value = ref(false)
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': function (newModelValue) {
          value.value = newModelValue
        }
      }
    })

    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()
    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0][1]).toBeFalsy()
  })

  describe('border', () => {
    test('set border props', async () => {
      const wrapper = mount(Checkbox, {})

      expect(wrapper.classes()).not.toContain('is-bordered')
      await wrapper.setProps({ border: true })
      expect(wrapper.classes()).toContain('is-bordered')
    })

    test('by elCheckboxGroup.border', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({ proxy: { border: true } })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-bordered')
    })
  })

  describe('size', () => {
    test('when border property does not exist, setting the size property is invalid', () => {
      const wrapper = mount(Checkbox, {
        props: { size: 'mini' }
      })

      expect(wrapper.classes()).not.toContain('el-checkbox--mini')
    })

    test('set border and size at the same time', async () => {
      const wrapper = mount(Checkbox, {
        props: { size: 'mini' }
      })

      await wrapper.setProps({ border: true })
      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by elCheckboxGroup.size', async () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({ proxy: { size: 'mini' } })
          }
        }
      })

      await wrapper.setProps({ border: true })
      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by elFormItem.size', async () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elFormItem: reactive({ size: 'mini' })
          }
        }
      })

      await wrapper.setProps({ border: true })
      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by global config', async () => {
      const wrapper = mount(Checkbox, {
        global: {
          plugins: [setupGlobalOptions({ size: 'mini' })]
        }
      })

      await wrapper.setProps({ border: true })
      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })
  })

  describe('disabled', () => {
    test('set disabled', async () => {
      const wrapper = mount(Checkbox)

      expect(wrapper.classes()).not.toContain('is-disabled')
      await wrapper.setProps({ disabled: true })
      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elCheckboxGroup.disabled', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({ proxy: { disabled: true } })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elFormItem.disabled', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elFormItem: reactive({ disabled: true })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })
  })

  test('name', async () => {
    const wrapper = mount(Checkbox)
    await wrapper.setProps({ name: 'checkbox' })

    expect(wrapper.get('input').attributes('name')).toBe('checkbox')
  })

  describe('true-label and false-label', () => {
    test('true-label', async () => {
      const value = ref(false)
      const trueLabel = ref('yes')
      const wrapper = mount(Checkbox, {
        props: { modelValue: value, trueLabel }
      })

      await nextTick()
      await wrapper.get('input').trigger('click')
      expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(trueLabel.value)
    })

    test('false-label', async () => {
      const value = ref(true)
      const falseLabel = ref('no')
      const wrapper = mount(Checkbox, {
        props: { modelValue: value, falseLabel }
      })

      await nextTick()
      await wrapper.get('input').trigger('click')
      expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(
        falseLabel.value
      )
    })
  })

  test('set checked should be checked', async () => {
    const value = ref(false)
    const wrapper = mount(Checkbox, {
      props: { modelValue: value, checked: true, label: 'apples' }
    })

    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()

    await wrapper.setProps({ modelValue: ref(true) })
    expect(wrapper.classes()).toContain('is-checked')
  })

  test('set indeterminate should be half-selected', async () => {
    const wrapper = mount(Checkbox, {
      props: { indeterminate: true }
    })

    await nextTick()
    expect(wrapper.find('.el-checkbox__input').classes()).toContain(
      'is-indeterminate'
    )
  })

  describe('focus', () => {
    test('when the checkbox is focused', async () => {
      const value = ref(false)
      const wrapper = mount(Checkbox, {
        props: { modelValue: value, label: 'apples' }
      })

      await wrapper.get('input').trigger('focus')
      expect(wrapper.find('.el-checkbox__input').classes()).toContain(
        'is-focus'
      )
    })

    test('when the checkbox is not focused', async () => {
      const value = ref(false)
      const wrapper = mount(Checkbox, {
        props: { modelValue: value, label: 'apples' }
      })

      await wrapper.get('input').trigger('blur')
      expect(wrapper.find('.el-checkbox__input').classes()).not.toContain(
        'is-focus'
      )
    })
  })

  test('the modelValue changes, the change event should be triggered', async () => {
    const value = ref(false)
    const wrapper = mount(Checkbox, {
      props: { modelValue: value }
    })

    await wrapper.setProps({ modelValue: ref(true) })
    await wrapper.get('input').trigger('change')
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted()['change'][0][0]).toBe(true)
  })

  test('when the parent component provides modelValue', async () => {
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          elCheckboxGroup: reactive({ proxy: { modelValue: ['one', 'two'] } })
        }
      },
      props: {
        label: 'one'
      }
    })

    await nextTick()
    expect(wrapper.get('input').element.checked).toBe(true)
  })

  test('select when clicked', async () => {
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          elCheckboxGroup: reactive({
            proxy: { modelValue: ['one'] }
          })
        }
      },
      props: {
        label: 'two'
      }
    })

    await wrapper.get('input').trigger('click')
    expect(wrapper.get('input').element.checked).toBe(true)
  })

  test('when unchecked', async () => {
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          elCheckboxGroup: reactive({
            proxy: { modelValue: ['one', 'two'] }
          })
        }
      },
      props: {
        label: 'one'
      }
    })

    await wrapper.get('input').trigger('click')
    expect(wrapper.get('input').element.checked).toBe(false)
  })
})
