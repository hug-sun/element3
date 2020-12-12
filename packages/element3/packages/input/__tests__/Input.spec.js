import Input from '../Input.vue'
import { mount as $mount } from '@vue/test-utils'
import Vue, { nextTick, component} from 'vue'


const mount = async (options) => {
  options = options || {}
  const wrapper = await $mount(Input, options)
  return wrapper
}


describe('render children by props.type', () => {
   it ('should render input text children', async () => {
       const wrapper = await mount({
         propsData: {
           type: 'button'
         },
         shallow: true
       })

       expect(wrapper.find('input-text-stub').isVisible()).toBe(true)
       expect(wrapper.find('input-text-area-stub').exists()).toBe(false)
   }) 

   it ('should render input textarea children', async () => {
      const wrapper = await mount({
        propsData: {
          type: 'textarea'
        },
        shallow: true
      })
      
      expect(wrapper.find('input-text-area-stub').isVisible()).toBe(true)
      expect(wrapper.find('input-text-stub').exists()).toBe(false)
    }) 
})


describe('pass attrs to children', () => {
  it ('get attrs in input chidren', async () => {
      const wrapper = await mount({
        propsData: {
          type: 'number',
          placeholder: "placeholder"
        }
      })
      
      expect(wrapper.find('.el-input__inner').attributes('placeholder')).toEqual('placeholder')
      expect(wrapper.find('.el-input__inner').attributes('type')).toEqual('number')
  }) 

  it ('get attrs in textarea chidren', async () => {
     const wrapper = await mount({
       propsData: {
         type: 'textarea',
         placeholder: "placeholder"
       }
     })
     
     expect(wrapper.find('.el-textarea__inner').attributes('placeholder')).toEqual('placeholder')
   }) 
})

describe('props', () => {
  it('should render disable', async () => {
    const wrapper = await mount({
      attrs: {
        disabled: 'disabled'
      }
    })
    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes('disabled')).not.toBeUndefined()
  })
})

describe('show-word-limit', () => {
  it('should render limit-word', async () => {
    const wrapper = await $mount({
          data: () => {
            return {
              text: "text"
            }
          },
          components: {Input},
          template: `<Input type="text" v-model="text" maxlength=10 show-word-limit />
        >`
    })
    
    wrapper.find('.el-input__inner').setValue('content')

    await nextTick()
    expect(wrapper.find('.el-input__count-inner').text()).toContain(`7/10`)
  })
})

describe('clearable', () => {
  it('should render clear btn', async () => {
    const wrapper = await $mount({
      data: () => {
         return {
           value: "test"
         }
      },
     
      components: {Input},
      template: `<Input v-model="value"  clearable/>`
    })
    
    expect(wrapper.find('.el-input__clear').exists()).toEqual(true)
  })

  it('clear value when click clear btn', async () => {
    const wrapper = await $mount({
      data: () => {
         return {
           value: "test"
         }
      },
     
      components: {Input},
      template: `<Input v-model="value" type="input" clearable/>`
    })
    
    wrapper.find('.el-input__clear').trigger('click')

    await nextTick()
    expect(wrapper.vm.value).toEqual('')
  })
})


describe('password', () => {
  it('show password input', async () => {
    const wrapper = await $mount({
      data: () => {
         return {
           value: "test"
         }
      },
     
      components: {Input},
      template: `<Input v-model="value" type="password" showPassword/>`
    })
    
    wrapper.find('.el-icon-view').trigger('click')

    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes('type')).toEqual('text')

    wrapper.find('.el-icon-view').trigger('click')

    await nextTick()
    expect(wrapper.find('.el-input__inner').attributes('type')).toEqual('password')
  })
})


describe('size', () => {
  it('should render props.size', async () => {
    const wrapper = await mount({
      propsData: {
        size: 'medium'
      }
    })

    expect(wrapper.find('div').classes()).toContain('el-input--medium')
  })
})

describe('prefixIcon', () => {
  it('should render props.prefixIcon', async () => {
    const wrapper = await mount({
      propsData: {
        prefixIcon: 'el-icon-view'
      }
    })

    expect(wrapper.find('.el-input__prefix').exists()).toBe(true)
  })
})

describe('suffix-icon', () => {
  it('should render props.suffixIcon', async () => {
    const wrapper = await mount({
      propsData: {
        suffixIcon: 'el-icon-view'
      }
    })

    expect(wrapper.find('.el-input__suffix').exists()).toBe(true)
  })
})

describe('autocomplete', () => {
  it('should render autocomplete', async () => {
    const wrapper = await mount({
      attrs: {
        autocomplete: 'off'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('autocomplete')).toEqual('off')
  })
})

describe('name attribute', () => {
  it('should render name attribute', async () => {
    const wrapper = await mount({
      attrs: {
        name: 'username'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('name')).toEqual('username')
  })
})

describe('readonly attribute', () => {
  it('should render readonly attribute', async () => {
    const wrapper = await mount({
      attrs: {
        readonly: ''
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('readonly')).not.toBeUndefined()
  })
})

describe('max attribute', () => {
  it('should render max attribute', async () => {
    const wrapper = await mount({
      attrs: {
        max: 13
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('max')).toEqual("13")
  })
})

describe('min attribute', () => {
  it('should render min attribute', async () => {
    const wrapper = await mount({
      attrs: {
        min: 13
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('min')).toEqual("13")
  })
})

describe('min attribute', () => {
  it('should render min attribute', async () => {
    const wrapper = await mount({
      attrs: {
        min: 13
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('min')).toEqual("13")
  })
})

describe('step attribute', () => {
  it('should render step attribute', async () => {
    const wrapper = await mount({
      attrs: {
        step: ","
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('step')).toEqual(",")
  })
})

describe('resize attribute', () => {
  it('should render resize attribute', async () => {
    const wrapper = await mount({
      attrs: {
        resize: "horizontal"
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('resize')).toEqual("horizontal")
  })
})

describe('autofocus attribute', () => {
  it('should render autofocus attribute', async () => {
    const wrapper = await mount({
      attrs: {
        autofocus: "autofocus"
      }
    })
   
    expect(wrapper.find('.el-input__inner').attributes('autofocus')).not.toBeUndefined()
  })
})

describe('form attribute', () => {
  it('should render form attribute', async () => {
    const wrapper = await mount({
      attrs: {
        form: 'form_id'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('form')).toEqual("form_id")
  })
})

describe('label attribute', () => {
  it('should render label attribute', async () => {
    const wrapper = await mount({
      attrs: {
        label: 'label'
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('label')).toEqual("label")
  })
})

describe('tabindex attribute', () => {
  it('should render tabindex attribute', async () => {
    const wrapper = await mount({
      attrs: {
        tabindex: 12
      }
    })

    expect(wrapper.find('.el-input__inner').attributes('tabindex')).toEqual("12")
  })
})

describe('validate-event attribute', () => {
  it('should call validate-event when validate-event eq true', async () => {
    var called = false
    const wrapper = await mount({
      propsData: {
        modelValue: 'test',
        validateEvent: true
      },
      global: {
        provide: {
          'elForm.change': () => { called = true}
        }
      }
    })

    await nextTick()
    
    wrapper.setProps({'modelValue': 'content'})
    await nextTick()
    expect(called).toBeTruthy()
  })

  it('should call validate-event when validate-event eq false', async () => {
    var called = false
    const wrapper = await mount({
      propsData: {
        modelValue: 'test',
        validateEvent: false
      },
      global: {
        provide: {
          'elForm.change': () => { called = true}
        }
      }
    })

    await nextTick()
   
    wrapper.setProps({'modelValue': 'content'})
    await nextTick()
    expect(called).toBeFalsy()
  })
})

describe('solt', () => {
  it('should render solt prefix', async () => {
    const wrapper = await mount({
      propsData: {
        prefixIcon: 'el-view'
      },
      slots: {
        prefix: 'prefix solt'
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input__prefix').html()).toContain("prefix solt")
  })

  it('should render solt suffix', async () => {
    const wrapper = await mount({
      propsData: {
        suffixIcon: 'el-view'
      },
      slots: {
        suffix: 'suffix solt'
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input__suffix').html()).toContain("suffix solt")
  })

  it('should render solt prepend', async () => {
    const wrapper = await mount({
      slots: {
        prepend: 'prepend solt'
      }
    })

    await nextTick()
    expect(wrapper.find('.el-input-group__prepend').html()).toContain("prepend solt")
  })
})
