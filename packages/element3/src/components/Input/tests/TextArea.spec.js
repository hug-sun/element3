import Input from '../src/Input.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('pass attrs to children', () => {
  it('get attrs in textarea chidren', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea',
        placeholder: 'placeholder'
      }
    })

    expect(
      wrapper.find('.el-textarea__inner').attributes('placeholder')
    ).toEqual('placeholder')
  })
})

describe('props', () => {
  it('should render disable', async () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        disabled: 'disabled'
      }
    })
    await nextTick()
    expect(wrapper.find('textarea').attributes()).toHaveProperty('disabled')
  })
})

describe('show-word-limit', () => {
  it('should render limit-word', async () => {
    const wrapper = mount({
      data: () => {
        return {
          text: 'textarea'
        }
      },
      components: { Input },
      template: `<Input type="textarea" v-model="text" maxlength=10 show-word-limit />`
    })

    wrapper.find('textarea').setValue('content')

    await nextTick()

    expect(wrapper.find('.el-input__count').text()).toContain(`7/10`)
  })
})

describe('name attribute', () => {
  it('should render name attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        name: 'username'
      }
    })

    expect(wrapper.find('textarea').attributes('name')).toEqual('username')
  })
})

describe('readonly attribute', () => {
  it('should render readonly attribute', async () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        readonly: ''
      }
    })

    expect(wrapper.find('textarea').attributes()).toHaveProperty('readonly')
  })
})

describe('max attribute', () => {
  it('should render max attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        max: 13
      }
    })

    expect(wrapper.find('textarea').attributes('max')).toEqual('13')
  })
})

describe('min attribute', () => {
  it('should render min attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        min: 13
      }
    })

    expect(wrapper.find('textarea').attributes('min')).toEqual('13')
  })
})

describe('autofocus attribute', () => {
  it('should render autofocus attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        autofocus: 'autofocus'
      }
    })

    expect(wrapper.find('textarea').attributes()).toHaveProperty('autofocus')
  })
})

describe('form attribute', () => {
  it('should render form attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        form: 'form_id'
      }
    })

    expect(wrapper.find('textarea').attributes('form')).toEqual('form_id')
  })
})

describe('label attribute', () => {
  it('should render label attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        label: 'label'
      }
    })

    expect(wrapper.find('textarea').attributes('label')).toEqual('label')
  })
})

describe('tabindex attribute', () => {
  it('should render tabindex attribute', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      },
      attrs: {
        tabindex: 12
      }
    })

    expect(wrapper.find('textarea').attributes('tabindex')).toEqual('12')
  })
})

describe('validate-event attribute', () => {
  it('should call validate-event when validate-event eq true', async () => {
    var called = false
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea',
        modelValue: 'test',
        validateEvent: true
      },
      global: {
        provide: {
          'elForm.change': () => {
            called = true
          }
        }
      }
    })

    await nextTick()

    wrapper.setProps({ modelValue: 'content' })
    await nextTick()
    expect(called).toBeTruthy()
  })

  it('should call validate-event when validate-event eq false', async () => {
    var called = false
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea',
        modelValue: 'test',
        validateEvent: false
      },
      global: {
        provide: {
          'elForm.change': () => {
            called = true
          }
        }
      }
    })

    await nextTick()

    wrapper.setProps({ modelValue: 'content' })
    await nextTick()
    expect(called).toBeFalsy()
  })
})

describe('blur', () => {
  it('should call custome blur event', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      }
    })

    wrapper.find('textarea').trigger('blur')
    expect(wrapper.emitted()).toHaveProperty('blur')
  })
})

describe('focus', () => {
  it('should call custome focus event', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      }
    })

    wrapper.find('textarea').trigger('focus')
    expect(wrapper.emitted()).toHaveProperty('focus')
  })
})

describe('change', () => {
  it('should call custome change event', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea',
        modelValue: 'value'
      }
    })

    wrapper.find('textarea').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0][0]).toEqual('value')
  })
})

describe('input', () => {
  it('should call custome input event', () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea',
        modelValue: 'value'
      }
    })

    wrapper.find('textarea').trigger('input')

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toEqual('value')
  })
})
