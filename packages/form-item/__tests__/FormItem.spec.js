import FormItem from '../FormItem.vue'
import { mount } from '@vue/test-utils'
import { nextTick, h, reactive } from 'vue'

describe('FormItem', () => {
  test('label', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名'
      },
      global: {
        provide: {
          elForm: {
            rules: {},
            labelSuffix: ''
          }
        }
      }
    })

    const label = wrapper.find('.el-form-item__label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('用户名')
  })

  test('label slot', () => {
    const wrapper = mount(FormItem, {
      slots: {
        label() {
          return '用户名：'
        }
      },
      global: {
        provide: {
          elForm: {
            rules: {}
          }
        }
      }
    })

    const label = wrapper.find('.el-form-item__label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('用户名：')
  })

  test('fixed label width', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        labelWidth: '80px'
      },
      global: {
        provide: {
          elForm: {
            rules: {}
          }
        }
      }
    })

    const label = wrapper.find('.el-form-item__label')
    expect(label.attributes().style).toContain('width: 80px')
  })

  test('auto label width', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        labelWidth: 'auto'
      },
      global: {
        provide: {
          elForm: {
            rules: {}
          }
        }
      }
    })

    const label = wrapper.find('.el-form-item__label')
    expect(label.attributes().style).toContain('width: auto')
  })

  test('should contain a is-required class when set property required', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        required: true
      },
      global: {
        provide: {
          elForm: {
            rules: {}
          }
        }
      }
    })

    const item = wrapper.find('.el-form-item')
    expect(item.classes()).toContain('is-required')
  })

  test('should contain a is-error class when validation is invalid', async () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        prop: 'username',
        rules: [{ required: true, message: '请输入用户名' }]
      },
      global: {
        provide: {
          elForm: {
            rules: {
              username: [{ required: true, message: '用户名为必填项' }]
            },
            model: {
              username: ''
            },
            emit() {}
          }
        }
      }
    })

    const item = wrapper.find('.el-form-item')
    expect(item.classes()).toContain('is-required')

    wrapper.vm.validate()
    await nextTick()

    expect(item.classes()).toContain('is-error')

    const error = wrapper.find('.el-form-item__error')
    setTimeout(() => {
      expect(error.exists()).toBe(true)
    }, 300)
  })

  test('should show a error message when set property error', async () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        error: 'some error'
      },
      global: {
        provide: {
          elForm: {}
        }
      }
    })

    const item = wrapper.find('.el-form-item')
    const error = wrapper.find('.el-form-item__error')
    expect(item.classes()).toContain('is-error')
    expect(wrapper.vm.validateState).toBe('error')
    setTimeout(() => {
      expect(error.exists()).toBe(true)
    }, 300)
  })

  test('small size', async () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名'
      },
      global: {
        provide: {
          elForm: {}
        }
      }
    })

    const item = wrapper.find('.el-form-item')
    expect(item.classes()).not.toContain('el-form-item--small')
    await wrapper.setProps({ size: 'small' })
    expect(item.classes()).toContain('el-form-item--small')
  })

  it('scoped slot error', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        error: '请输入用户名'
      },
      slots: {
        error: ({ error }) => h('div', { class: 'error-message' }, error)
      },
      global: {
        provide: {
          elForm: {}
        }
      }
    })

    const error = wrapper.find('.error-message')
    setTimeout(() => {
      expect(error.exists()).toBe(true)
    }, 300)
  })

  it('clear validate result', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        error: '请输入用户名'
      },
      global: {
        provide: {
          elForm: {}
        }
      }
    })

    // 错误class和errorMessage一开始有
    const item = wrapper.find('.el-form-item')
    const error = wrapper.find('.el-form-item__error')
    expect(item.classes()).toContain('is-error')

    // 清除校验内容之后，希望清除掉error class和errorMessage
    wrapper.vm.clearValidate()

    setTimeout(() => {
      expect(item.classes()).not.toContain('is-error')
      expect(error.exists()).toBe(false)
    }, 300)
  })

  it('reset field', async () => {
    const model = reactive({
      username: 'young cunzhang'
    })
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        prop: 'username',
        rules: [{ required: true, message: '请输入用户名' }]
      },
      global: {
        provide: {
          elForm: { model, emit() {} }
        }
      }
    })

    // 一开始username有值，验证一下initialValue
    const vm = wrapper.vm
    // 把初始值置空，然后执行校验
    model.username = ''
    vm.validate()
    await nextTick()

    // 此时会添加error class
    const item = wrapper.find('.el-form-item')
    expect(item.classes()).toContain('is-error')

    // 重置字段
    vm.resetField()
    await nextTick()

    // 此时error class应该移除
    expect(item.classes()).not.toContain('is-error')
  })
})
