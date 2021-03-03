import Step from '../src/Step.vue'
import Steps from '../src/Steps.vue'
import { mount } from '@vue/test-utils'

/*
- [ ] Add a circle
- [ ] Add a horizontal line
- [ ] Add a description
- [ ] x element
- [ ]
 */

describe('Step', () => {
  it('registry self to steps', () => {
    const registryFn = jest.fn()

    const steps = {
      add: registryFn
    }

    const wrapper = mount(Step, {
      global: {
        provide: {
          steps
        }
      }
    })

    expect(registryFn).toBeCalled()
    expect(registryFn).toHaveBeenCalledWith(wrapper.vm)
  })
})

describe.skip('Steps', () => {
  it('should have 1 element', function () {
    let steps = mount(Steps, {
      slots: {
        default: [Step, '<div class=".el-step"></div>']
      }
    })
    let step = steps.findAll('.el-step')
    expect(step.length).toBe(1)
  })
})
describe.skip('Can create a Step component', () => {
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
