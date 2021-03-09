import RadioButton from '../src/RadioButton.vue'
import RadioGroup from '../../RadioGroup/src/RadioGroup.vue'
import { mount } from '@vue/test-utils'
import { expectHaveClass } from '../../../../tests/helper'
import { ref, h, nextTick, reactive } from 'vue'

const content = ['上海', '北京']

describe('radioButton.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(RadioButton)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('should show content', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        size: 'mini'
      },
      slots: {
        default: content.map((label) => h(RadioButton, { label }))
      }
    })

    wrapper.findAllComponents({ name: 'ElRadioButton' }).forEach((item, i) => {
      expect(item.text()).toContain(content[i])
    })
  })

  it('size', async () => {
    const wrapper = mount(RadioGroup, {
      slots: {
        default: content.map((label) => h(RadioButton, { label }))
      }
    })

    await wrapper.setProps({ size: 'mini' })
    expectHaveClass(
      wrapper.findComponent({ name: 'ElRadioButton' }),
      `el-radio-button--mini`
    )

    await wrapper.setProps({ size: 'small' })

    expectHaveClass(
      wrapper.findComponent({ name: 'ElRadioButton' }),
      `el-radio-button--small`
    )

    await wrapper.setProps({ size: 'medium' })

    expectHaveClass(
      wrapper.findComponent({ name: 'ElRadioButton' }),
      `el-radio-button--medium`
    )
  })

  it('modelValue', async () => {
    const modelValue = ref('')
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue,
        'onUpdate:modelValue'(v) {
          modelValue.value = v
        }
      },
      slots: {
        default: content.map((label) => h(RadioButton, { label }))
      }
    })

    await wrapper
      .findAllComponents({ name: 'ElRadioButton' })[0]
      .trigger('click')
    expect(modelValue.value).toStrictEqual('上海')

    await wrapper
      .findAllComponents({ name: 'ElRadioButton' })[1]
      .trigger('click')
    expect(modelValue.value).toStrictEqual('北京')
  })

  it('disabled', async () => {
    const modelValue = ref('')
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue,
        'onUpdate:modelValue'(v) {
          modelValue.value = v
        }
      },
      slots: {
        default: content.map((label) => h(RadioButton, { label }))
      }
    })

    await wrapper.setProps({ disabled: true })
    expectHaveClass(
      wrapper.findComponent({ name: 'ElRadioButton' }),
      'is-disabled'
    )

    await wrapper
      .findAllComponents({ name: 'ElRadioButton' })[1]
      .trigger('click')
    expect(modelValue.value).toStrictEqual('')
  })

  it('by elForm.disable', () => {
    const wrapper = mount(RadioButton, {
      global: {
        provide: {
          elForm: reactive({
            disabled: true
          })
        }
      }
    })
    expect(wrapper.classes()).toContain(`is-disabled`)
  })

  it('is-active', async () => {
    const modelValue = ref('')
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue,
        'onUpdate:modelValue'(v) {
          modelValue.value = v
        }
      },
      slots: {
        default: content.map((label) => h(RadioButton, { label }))
      }
    })

    await wrapper
      .findAllComponents({ name: 'ElRadioButton' })[0]
      .trigger('click')

    expectHaveClass(
      wrapper.findAllComponents({ name: 'ElRadioButton' })[0],
      'is-active'
    )
  })

  describe('event', () => {
    it('change', async () => {
      const modelValue = ref('')
      const changeValue = ref('')
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          },
          onChange(v) {
            changeValue.value = v
          }
        },
        slots: {
          default: content.map((label) => h(RadioButton, { label }))
        }
      })
      await wrapper
        .findAllComponents({ name: 'ElRadioButton' })[1]
        .trigger('click')
      expect(modelValue.value).toStrictEqual('北京')
      await nextTick()
      expect(changeValue.value).toStrictEqual('北京')
    })
  })
})
