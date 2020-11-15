import Button from '../Button.vue'
import { mount } from '@vue/test-utils'

it('content', () => {
  const Comp = {
    template: `<div><Button>默认按钮</Button></div>`
  }

  const wrapper = mount(Comp, {
    global: {
      components: {
        Button
      }
    }
  })

  expect(wrapper.findComponent({ name: 'ElButton' }).text()).toContain(
    '默认按钮'
  )
})

describe('size', () => {
  it('should have a el-button--mini class when set size prop value equal to mini', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'mini'
      }
    })

    expect(wrapper.classes()).toContain('el-button--mini')
  })

  it('should have a el-button--mini class by elFormItem ', () => {
    const wrapper = mount(Button, {
      global: {
        provide: {
          elFormItem: {
            elFormItemSize: 'mini'
          }
        }
      }
    })

    expect(wrapper.classes()).toContain('el-button--mini')
  })
  it('should have a el-button--mini class by $ELEMENT value ', () => {
    const wrapper = mount(Button, {
      global: {
        config: {
          globalProperties: {
            $ELEMENT: {
              size: 'mini'
            }
          }
        }
      }
    })

    expect(wrapper.classes()).toContain('el-button--mini')
  })
})

it('type', () => {
  const wrapper = mount(Button, {
    props: {
      type: 'primary'
    }
  })

  expect(wrapper.classes()).toContain('el-button--primary')
})

it('plain', () => {
  const wrapper = mount(Button, {
    props: {
      plain: true
    }
  })

  expect(wrapper.classes()).toContain('is-plain')
})
it('round', () => {
  const wrapper = mount(Button, {
    props: {
      round: true
    }
  })

  expect(wrapper.classes()).toContain('is-round')
})

it('circle', () => {
  const wrapper = mount(Button, {
    props: {
      circle: true
    }
  })

  expect(wrapper.classes()).toContain('is-circle')
})
it('loading', () => {
  const wrapper = mount(Button, {
    props: {
      loading: true
    }
  })

  expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
  expect(wrapper.classes()).toContain('is-loading')
})

describe('icon', () => {
  it('should show icon element', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'el-icon-edit'
      }
    })

    expect(wrapper.find('.el-icon-edit').exists()).toBe(true)
  })

  it('should not show icon element when set loading prop equal to true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        icon: 'el-icon-edit'
      }
    })

    expect(wrapper.find('.el-icon-edit').exists()).toBe(false)
  })
})

describe('click', () => {
  it('should emit click event ', () => {
    const wrapper = mount(Button)

    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should not emit click event when disabled equal to true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })

    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('should not emit click event when elForm disabled equal to true', () => {
    const wrapper = mount(Button, {
      global: {
        provide: {
          elForm: {
            disabled: true
          }
        }
      }
    })

    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('should not emit click event when loading prop equal to true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })
})

it('native-type', () => {
  const wrapper = mount(Button, {
    props: {
      nativeType: 'button'
    }
  })

  expect(wrapper.attributes('type')).toBe('button')
})
