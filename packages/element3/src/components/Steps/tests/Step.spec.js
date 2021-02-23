import Step from '../src/Step.vue'
import { mount } from '@vue/test-utils'

/*
- [ ] Add a circle
- [ ] Add a horizontal line
- [ ] Add a description
 */

describe('Can create a Step component', () => {
  it('should have "Hello" as content', () => {
    const wrapper = mount(Step, {
      props: {
        title: 'Hello'
      }
    })
    let element = wrapper.find('.el-step__title')
    expect(element.text()).toBe('Hello')
  })
  it('should have "World" as content', () => {
    const wrapper = mount(Step, {
      props: {
        title: 'World'
      }
    })
    let element = wrapper.find('.el-step__title')
    expect(element.text()).toBe('World')
  })
})
