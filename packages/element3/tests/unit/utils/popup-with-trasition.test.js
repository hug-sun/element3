import { mount } from '@vue/test-utils'

import { withTransition } from '../../../src/utils/popupService/index'

describe('popup service withTrasition', () => {
  it('should render trasition when props transitionClass exist', () => {
    const child = <div>child</div>

    const wrapper = mount(withTransition(child), {
      props: { transitionClass: 'el-out' }
    })

    expect(wrapper.find('transition-stub').exists()).toBeTruthy()
  })

  it('should not render trasition when props transitionClass not exist', () => {
    const child = <div>child</div>
    const wrapper = mount(withTransition(child))

    expect(wrapper.find('transition-stub').exists()).toBeFalsy()
  })

  it('should  render children', () => {
    const child = <div>child</div>
    const wrapper = mount(withTransition(child), {
      props: { transitionClass: 'el-out' }
    })

    expect(wrapper.html()).toContain('child')
  })
})
