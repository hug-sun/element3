import Checkbox from '../Checkbox'
import { mount } from '@vue/test-utils'
import { ref, reactive, nextTick } from 'vue'
import { setupGlobalOptions } from '../../../src/use/globalConfig'

describe('Checkbox.vue', () => {
  test('the default slot content should be displayed', () => {
    const wrapper = mount(Checkbox, {
      slots: {
        default: 'an apple'
      }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe('an apple')
  })

  test('should display the label attribute content', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'two apples'
      }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe('two apples')
  })

  test('slot and label exist at the same time, the content of the slot should be displayed', () => {
    const wrapper = mount(Checkbox, {
      slots: {
        default: 'an apple'
      },
      props: {
        label: 'two apples'
      }
    })

    expect(wrapper.find('.el-checkbox__label').text()).toBe('an apple')
  })

  test('no label and slot are set, content should not be displayed', () => {
    const wrapper = mount(Checkbox, {
      modelValue: ref(true)
    })

    expect(wrapper.find('.el-checkbox__label').exists()).toBe(false)
  })

  test('update:modelValue', async () => {
    const value = ref(false)
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: value
      }
    })

    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()
  })

  describe('border', () => {
    test('set border props', () => {
      const wrapper = mount(Checkbox, {
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('is-bordered')
    })

    test('by elCheckboxGroup.border', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({
              border: true
            })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-bordered')
    })
  })

  describe('size', () => {
    test('when border property does not exist, setting the size property is invalid', () => {
      const wrapper = mount(Checkbox, {
        props: {
          size: 'mini'
        }
      })

      expect(wrapper.classes()).not.toContain('el-checkbox--mini')
    })

    test('set border and size at the same time', () => {
      const wrapper = mount(Checkbox, {
        props: {
          border: true,
          size: 'mini'
        }
      })

      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by elCheckboxGroup.size', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({
              size: 'mini'
            })
          }
        },
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by elFormItem.size', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elFormItem: reactive({
              size: 'mini'
            })
          }
        },
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })

    test('by global config', () => {
      const wrapper = mount(Checkbox, {
        global: {
          plugins: [
            setupGlobalOptions({
              size: 'mini'
            })
          ]
        },
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('el-checkbox--mini')
    })
  })

  describe('disabled', () => {
    test('Checkbox set disabled props', async () => {
      const wrapper = mount(Checkbox, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
      expect(
        wrapper.find('.el-checkbox__original').attributes()
      ).toHaveProperty('disabled')
    })

    test('by elCheckboxGroup.disabled', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elCheckboxGroup: reactive({
              disabled: true
            })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
      expect(
        wrapper.find('.el-checkbox__original').attributes()
      ).toHaveProperty('disabled')
    })

    test('by elFormItem.disabled', () => {
      const wrapper = mount(Checkbox, {
        global: {
          provide: {
            elFormItem: reactive({
              disabled: true
            })
          }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
      expect(
        wrapper.find('.el-checkbox__original').attributes()
      ).toHaveProperty('disabled')
    })
  })

  test('set the native name attribute', () => {
    const wrapper = mount(Checkbox, {
      props: {
        name: 'checkbox'
      }
    })

    expect(wrapper.find('.el-checkbox__original').attributes('name')).toBe(
      'checkbox'
    )
  })

  describe('true-label and false-label', () => {
    test('true-label', async () => {
      const value = ref(false)
      const trueLabel = ref('yes')
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: value,
          trueLabel
        }
      })

      await nextTick()
      await wrapper.get('input').trigger('click')
      expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(trueLabel.value)
    })

    test('false-label', async () => {
      const value = ref(true)
      const falseLabel = ref('no')
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: value,
          falseLabel
        }
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
      props: {
        modelValue: value,
        checked: true,
        label: 'apples'
      }
    })

    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()

    await wrapper.setProps({ modelValue: ref(true) })
    expect(wrapper.classes()).toContain('is-checked')
  })

  test('set indeterminate should be half-selected', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        indeterminate: true
      }
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
        props: {
          modelValue: value,
          label: 'apples'
        }
      })

      await wrapper.get('input').trigger('focus')
      expect(wrapper.find('.el-checkbox__input').classes()).toContain(
        'is-focus'
      )
    })

    test('when the checkbox is not focused', async () => {
      const value = ref(false)
      const wrapper = mount(Checkbox, {
        props: {
          modelValue: value,
          label: 'apples'
        }
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
      props: {
        modelValue: value
      }
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
          elCheckboxGroup: reactive({
            modelValue: ['one', 'two']
          })
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
            modelValue: ['one'],
            update: () => {}
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
            modelValue: ['one', 'two'],
            update: () => {}
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

  test('should trigger parent update', async () => {
    const spy = jest.fn()
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          elCheckboxGroup: {
            modelValue: ['one'],
            update: spy
          }
        }
      },
      props: {
        label: 'two'
      }
    })

    await wrapper.get('input').trigger('click')
    expect(spy).toBeCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['one', 'two'])
  })

  test('should trigger parent change', async () => {
    const spy = jest.fn()
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          elCheckboxGroup: {
            modelValue: ['one'],
            update: () => {},
            change: spy
          }
        }
      },
      props: {
        label: 'two'
      }
    })

    await wrapper.get('input').trigger('click')
    await nextTick()
    expect(spy).toBeCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['one', 'two'])
  })
})
