import { mount } from '@vue/test-utils'

import { withTrasition } from '../../../src/utils/popupService/index'

describe('popup service withTrasition', () => {
  it('should render trasition when props transitionClass exist', () => {
    const wrapper = mount(withTrasition, { transitionClass: 'el-out' })

    expect(wrapper.find('trasition-stub').exists()).toBeTruthy()
  })

  it('should not render trasition when props transitionClass not exist', () => {
    const wrapper = mount(withTrasition, { transitionClass: 'el-out' })

    expect(wrapper.find('trasition-stub').exists()).toBeFalsy()
  })

  it('should  render children when pass children', () => {
    const child = <div>child</div>
    const wrapper = mount(withTrasition(child), { transitionClass: 'el-out' })

    expect(wrapper.html()).toContain('<div>child</div>')
  })
})
