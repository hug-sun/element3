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

  it('form-item size', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        size: ''
      },
      global: {
        provide: {
          elFormItem: {
            elFormItemSize: 'small'
          }
        }
      }
    })

    expect(wrapper.vm.radioGroupSize).toEqual('small')

    await wrapper.setProps({
      size: 'medium'
    })
    expect(wrapper.vm.radioGroupSize).toEqual('medium')
  })

  it('size', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        size: 'mini'
      }
    })

    expect(wrapper.vm.radioGroupSize).toEqual('mini')

    await wrapper.setProps({
      size: 'small'
    })
    expect(wrapper.vm.radioGroupSize).toEqual('small')
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
