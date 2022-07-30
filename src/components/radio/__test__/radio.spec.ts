// import { render } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'
import RadioButton from '../RadioButton.vue'

describe('Radio.vue', () => {
  it('content', () => {
    const vm = mount(Radio, {
      slots: {
        default: () => '单选框',
      },
    })
    expect(vm.text()).toBe('单选框')
  })

  it('selected', () => {
    const vm = mount(Radio, {
      props: {
        modelValue: 1,
        label: 1,
      },
    })
    expect(vm.find('.is-checked').exists()).toBe(true)
  })

  it('disable', () => {
    const vm = mount(Radio, {
      props: { disabled: true },
    })
    expect(vm.find('span').classes()).toContain('is-disabled')
  })

  it('radioGroup', () => {
    const vm = mount(RadioGroup, {
      slots: {
        default: () => Radio,
      },
    })
    expect(vm.find('div').classes()).toContain('el-radio-group')
  })

  it('radioButton', () => {
    const vm = mount(RadioButton, {
      slots: {
        default: () => Radio,
      },
    })
    expect(vm.find('label').classes()).toContain('el-radio-button')
  })
})
