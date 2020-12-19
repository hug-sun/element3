import CheckboxGroup from '../CheckboxGroup'
import { mount } from '@vue/test-utils'

describe('CheckboxGroup.vue', () => {
  test('support default slot', () => {
    const text = 'welcome'
    const wrapper = mount(CheckboxGroup, {
      slots: {
        default: text
      }
    })

    expect(wrapper.text()).toBe(text)
  })

  test('default props.modelValue', () => {
    const wrapper = mount(CheckboxGroup, {})

    expect(wrapper.props('modelValue')).toEqual([])
  })

  test('props.modelValue', () => {
    const values = ['apples', 'potatoes']
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: values
      }
    })

    expect(wrapper.props('modelValue')).toEqual(values)
  })
})
