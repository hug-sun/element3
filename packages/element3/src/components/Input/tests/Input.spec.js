import Input from '../src/Input.vue'
import { mount, shallowMount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { props } from '../src/props'

describe('test props size valiate', () => {
  it('snapshot', () => {
    const wrapper = mount(Input)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('test props size valiate ', () => {
    expect(props.size.validator('mini')).toBeTruthy()
    expect(props.size.validator('small')).toBeTruthy()
    expect(props.size.validator('medium')).toBeTruthy()
  })
})
describe('render children by props.type', () => {
  it('should render input text ', async () => {
    const wrapper = shallowMount(Input, {
      propsData: {
        type: 'button'
      }
    })

    expect(wrapper.find('input').isVisible()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('should render input textarea ', async () => {
    const wrapper = mount(Input, {
      propsData: {
        type: 'textarea'
      }
    })

    expect(wrapper.find('textarea').isVisible()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })
})

describe('props', () => {
  it('should render disable', async () => {
    const wrapper = mount(Input, {
      attrs: {
        disabled: 'disabled'
      }
    })
    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes()).toHaveProperty(
      'disabled'
    )
  })
})

describe('show-word-limit', () => {
  it('should render limit-word', async () => {
    const wrapper = mount({
      data: () => {
        return {
          text: 'text'
        }
      },
      components: { Input },
      template: `<Input type="text" v-model="text" maxlength=10 show-word-limit />
        >`
    })

    expect(wrapper.find('.el-input').classes()).not.toContain('is-exceed')
    wrapper.find('.el-input__inner').setValue('content test')

    await nextTick()
    expect(wrapper.find('.el-input__count-inner').text()).toContain(`10/10`)
    expect(wrapper.find('.el-input').classes()).toContain('is-exceed')
  })
})

describe('clearable', () => {
  it('should render clear btn', () => {
    const wrapper = mount({
      setup() {
        const value = ref('')
        return {
          value
        }
      },
      components: { Input },
      template: `<Input v-model="value"  clearable/>`
    })

    expect(wrapper.find('.el-input__clear').exists()).toBeTruthy()
  })

  it('clear value when click clear btn', async () => {
    const wrapper = mount({
      setup() {
        const input = ref('value')
        return {
          input
        }
      },
      components: { Input },
      template: `<Input v-model="input" type="text" clearable/>`
    })

    wrapper.find('.el-input__clear').trigger('click')
    await nextTick()
    expect(wrapper.vm.input).toBe('')
  })
})

describe('password', () => {
  it('show password input', async () => {
    const wrapper = mount({
      data: () => {
        return {
          value: 'test'
        }
      },

      components: { Input },
      template: `<Input v-model="value" type="password" showPassword/>`
    })

    wrapper.find('.el-icon-view').trigger('click')

    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes('type')).toEqual('text')

    wrapper.find('.el-icon-view').trigger('click')

    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes('type')).toEqual(
      'password'
    )
  })
})

describe('size', () => {
  it('should render props.size', () => {
    const wrapper = mount(Input, {
      propsData: {
        size: 'medium'
      }
    })

    expect(wrapper.find('div').classes()).toContain('el-input--medium')
  })
})

describe('prefixIcon', () => {
  it('should render props.prefixIcon', () => {
    const wrapper = mount(Input, {
      propsData: {
        prefixIcon: 'el-icon-view'
      }
    })

    expect(wrapper.find('.el-input__prefix').exists()).toBe(true)
  })
})

describe('suffix-icon', () => {
  it('should render props.suffixIcon', () => {
    const wrapper = mount(Input, {
      propsData: {
        suffixIcon: 'el-icon-view'
      }
    })

    expect(wrapper.find('.el-input__suffix').exists()).toBe(true)
  })
})

describe('autocomplete', () => {
  it('should render autocomplete', async () => {
    const wrapper = mount(Input, {
      attrs: {
        autocomplete: 'off'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('autocomplete')).toEqual(
      'off'
    )
  })
})

describe('name attribute', () => {
  it('should render name attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        name: 'username'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('name')).toEqual(
      'username'
    )
  })
})

describe('readonly attribute', () => {
  it('should render readonly attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        readonly: ''
      }
    })

    expect(wrapper.find('.el-input__inner').attributes()).toHaveProperty(
      'readonly'
    )
  })
})

describe('max attribute', () => {
  it('should render max attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        max: 13
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('max')).toEqual('13')
  })
})

describe('min attribute', () => {
  it('should render min attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        min: 13
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('min')).toEqual('13')
  })
})

describe('step attribute', () => {
  it('should render step attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        step: ','
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('step')).toEqual(',')
  })
})

describe('autofocus attribute', () => {
  it('should render autofocus attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        autofocus: 'autofocus'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes()).toHaveProperty(
      'autofocus'
    )
  })
})

describe('form attribute', () => {
  it('should render form attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        form: 'form_id'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('form')).toEqual(
      'form_id'
    )
  })
})

describe('label attribute', () => {
  it('should render label attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        label: 'label'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('label')).toEqual(
      'label'
    )
  })
})

describe('tabindex attribute', () => {
  it('should render tabindex attribute', () => {
    const wrapper = mount(Input, {
      attrs: {
        tabindex: 12
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('tabindex')).toEqual(
      '12'
    )
  })
})

describe('validate-event attribute', () => {
  it('should call validate-event when validate-event eq true', async () => {
    var called = false
    const wrapper = mount(Input, {
      propsData: {
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

describe('solt', () => {
  it('should render solt prefix', async () => {
    const slot = 'prefix solt'
    const wrapper = mount(Input, {
      propsData: {
        prefixIcon: 'el-view'
      },
      slots: {
        prefix: slot
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input__prefix').html()).toContain(slot)
  })

  it('should render solt suffix', async () => {
    const slot = 'suffix solt'
    const wrapper = mount(Input, {
      propsData: {
        suffixIcon: 'el-view'
      },
      slots: {
        suffix: slot
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input__suffix').html()).toContain(slot)
  })

  it('should render solt prepend', async () => {
    const slot = 'prepend solt'
    const wrapper = mount(Input, {
      slots: {
        prepend: slot
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input-group__prepend').html()).toContain(slot)
  })

  it('should render solt append', async () => {
    const slot = 'append solt'
    const wrapper = mount(Input, {
      slots: {
        append: slot
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input-group__append').html()).toContain(slot)
  })
})

describe('blur', () => {
  it('should call custome blur event', async () => {
    const wrapper = mount(Input)

    wrapper.find('input').trigger('blur')
    expect(wrapper.emitted()).toHaveProperty('blur')
  })
})

describe('focus', () => {
  it('should call custome focus event', async () => {
    const wrapper = mount(Input)

    wrapper.find('input').trigger('focus')
    expect(wrapper.emitted()).toHaveProperty('focus')
  })
})

describe('change', () => {
  it('should call custome change event', async () => {
    const wrapper = mount(Input, {
      propsData: {
        modelValue: 'value'
      }
    })

    wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0][0]).toEqual('value')
  })
})

describe('input', () => {
  it('should call custome input event', async () => {
    const wrapper = mount(Input, {
      propsData: {
        modelValue: 'value'
      }
    })

    wrapper.find('input').trigger('input')

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toEqual('value')
  })
})
describe('clear', () => {
  it('click clear btn should call custom call', () => {
    const wrapper = mount(Input, {
      propsData: {
        modelValue: 'value',
        suffixIcon: 'el-view'
      },
      attrs: {
        clearable: true
      }
    })
    wrapper.find('.el-input__clear').trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})

describe('methods', () => {
  it('should export method focus', () => {
    const wrapper = mount({
      setup() {
        const inputRef = ref(null)
        return {
          inputRef
        }
      },
      components: { Input },
      template: `<Input ref="inputRef" />`
    })

    expect(wrapper.vm.inputRef.focus).toBeDefined()
  })

  it('should export method blur', () => {
    const wrapper = mount({
      setup() {
        const inputRef = ref(null)
        return {
          inputRef
        }
      },
      components: { Input },
      template: `<Input ref="inputRef"/>`
    })

    expect(wrapper.vm.inputRef.blur).toBeDefined()
  })

  it('should export method select', () => {
    const wrapper = mount({
      setup() {
        const inputRef = ref(null)
        return {
          inputRef
        }
      },
      components: { Input },
      template: `<Input ref="inputRef"/>`
    })

    expect(wrapper.vm.inputRef.select).toBeDefined()
  })
})
