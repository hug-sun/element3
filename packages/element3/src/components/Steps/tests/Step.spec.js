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

  it('title by prop.title', () => {
    const wrapper = mount(Step, {
      props: {
        title: '步骤一'
      }
    })

    expect(wrapper.text()).toContain('步骤一')
  })

  it('description by prop.title', () => {
    const wrapper = mount(Step, {
      props: {
        description: '这是一个描述性文字'
      }
    })

    expect(wrapper.text()).toContain('这是一个描述性文字')
  })

  it('icon by prop.icon', () => {
    const wrapper = mount(Step, {
      props: {
        icon: 'el-icon'
      }
    })

    expect(wrapper.find('.el-icon')).toBeExist()
  })

  it('icon by prop.icon slot', () => {
    const wrapper = mount(Step, {
      slots: { icon: '<div class="test-slot"></div>' }
    })

    expect(wrapper.find('.test-slot')).toBeExist()
  })

  it('icon by slot vs class', () => {
    const wrapper = mount(Step, {
      props: { icon: 'el-icon' },
      slots: { icon: '<div class="test-slot"></div>' }
    })

    expect(wrapper.find('.test-slot')).toBeExist()
    expect(wrapper.find('.el-icon')).not.toBeExist()
  })

  it('status by props.status', () => {
    const wrapper = mount(Step, {
      props: { status: 'success' }
    })
    console.log(wrapper.element.innerHTML)
    expect(wrapper.find('.is-success')).toBeExist()
  })
})
