import CheckboxGroup from '../CheckboxGroup'
import Checkbox from '../../checkbox-dev/Checkbox'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'

describe('CheckboxGroup.vue', () => {
  test('support default slot', () => {
    const text = 'welcome'
    const wrapper = mount(CheckboxGroup, {
      slots: { default: text }
    })

    expect(wrapper.text()).toBe(text)
  })

  test('props.modelValue', async () => {
    const values = ref(['one'])
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: values,
        'onUpdate:modelValue': function (newValue) {
          values.value = newValue
        }
      },
      slots: {
        default: ['two'].map((label) => h(Checkbox, { label }))
      }
    })

    await wrapper
      .findComponent({ name: 'ElCheckbox' })
      .get('input')
      .trigger('click')

    expect(values.value).toEqual(['one', 'two'])
  })

  test('props.size', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { border: true },
      slots: { default: ['A'].map((label) => h(Checkbox, { label })) }
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

  test('props.disabled', async () => {
    const wrapper = mount(CheckboxGroup, {
      slots: { default: ['A', 'B'].map((label) => h(Checkbox, { label })) }
    })

    await wrapper.setProps({ disabled: true })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `is-disabled`
    )

    await wrapper.setProps({ disabled: false })
    expect(
      wrapper.findComponent({ name: 'ElCheckbox' }).classes()
    ).not.toContain(`is-disabled`)
  })

  test('props.border', async () => {
    const wrapper = mount(CheckboxGroup, {
      slots: { default: ['A', 'B'].map((label) => h(Checkbox, { label })) }
    })

    await wrapper.setProps({ border: true })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      'is-bordered'
    )

    await wrapper.setProps({ border: false })
    expect(
      wrapper.findComponent({ name: 'ElCheckbox' }).classes()
    ).not.toContain('is-bordered')
  })
})
