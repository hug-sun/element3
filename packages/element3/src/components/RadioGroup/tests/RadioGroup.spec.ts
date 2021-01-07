import RadioGroup from '../src/RadioGroup.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('radioGroup.vue', () => {
  it('should show content', () => {
    const wrapper = mount(RadioGroup, {
      slots: {
        default: 'radioGroup'
      }
    })

    expect(wrapper).toHaveTextContent('radioGroup')
  })

  it('form-item size', () => {
    const wrapper = mount(RadioGroup, {
      global: {
        provide: {
          elFormItem: {
            elFormItemSize: 'small'
          }
        }
      }
    })

    expect(wrapper.vm.radioGroupSize).toEqual('small')
  })

  it('size', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        size: 'mini'
      }
    })

    expect(wrapper.vm.radioGroupSize).toEqual('mini')
  })

  it('modelValue', async () => {
    const modelValue = ref('')
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue,
        'update:modelValue'(v) {
          modelValue.value = v
        }
      }
    })

    await wrapper.setProps({ modelValue: '上海' })
    expect(wrapper.vm.modelValue).toEqual('上海')
  })
})
