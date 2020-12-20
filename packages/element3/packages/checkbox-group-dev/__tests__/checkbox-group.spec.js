import CheckboxGroup from '../CheckboxGroup'
import Checkbox from '../../checkbox-dev/Checkbox'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

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

  test('props.size', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        border: true
      },
      slots: {
        default: ['A'].map((label) => h(Checkbox, { label }))
      }
    })

    await wrapper.setProps({ size: 'mini' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--mini`
    )

    await wrapper.setProps({ size: 'small' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--small`
    )

    await wrapper.setProps({ size: 'medium' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--medium`
    )
  })
})
