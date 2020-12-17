import { mount } from '@vue/test-utils'
import Progress from '../Progress.vue'

describe('Progress.vue', () => {
  it('should create progress component', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 55
      }
    })
    expect(wrapper.text()).toContain('55%')
  })
})
