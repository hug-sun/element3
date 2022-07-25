// import { render } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import Radio from '../Radio.vue'

describe('Radio.vue', () => {
  it('content', () => {
    const vm = mount(Radio, {
      slots: {
        default: () => '单选框',
      },
    })
    expect(vm.text()).toBe('单选框')
  })
})
