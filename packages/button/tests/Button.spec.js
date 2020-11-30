import Button from '../Button.vue'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { setupGlobalOptions } from '../../../src/use/globalConfig'

describe('Button.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Button)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should show content', () => {
    const content = 'foo'

    const wrapper = mount(Button, {
      slots: {
        default: content
      }
    })

    expect(wrapper.text()).toContain(content)
  })

  describe('set button size', () => {
    it('by props.size', () => {
      const size = 'small'

      const wrapper = mount(Button, {
        props: {
          size
        }
      })

      expect(wrapper.classes()).toContain(`el-button--${size}`)
    })

    it('by elFormItem.elFormItemSize', () => {
      const size = 'small'
      const wrapper = mount(Button, {
        props: {
          size: ''
        },
        global: {
          provide: {
            elFormItem: reactive({
              elFormItemSize: size
            })
          }
        }
      })

      expect(wrapper.classes()).toContain(`el-button--${size}`)
    })

    it('by global config ', () => {
      const size = 'small'
      const wrapper = mount(Button, {
        props: {
          size: ''
        },
        global: {
          plugins: [
            setupGlobalOptions({
              size
            })
          ]
        }
      })

      expect(wrapper.classes()).toContain(`el-button--${size}`)
    })
  })

  it('set button type by prop type ', () => {
    const type = 'success'

    const wrapper = mount(Button, {
      props: {
        type
      }
    })

    expect(wrapper.classes()).toContain(`el-button--${type}`)
  })

  it('set button plain by prop type', () => {
    const wrapper = mount(Button, {
      props: {
        plain: true
      }
    })

    expect(wrapper.classes()).toContain(`is-plain`)
  })
  it('set button round by prop type', () => {
    const wrapper = mount(Button, {
      props: {
        round: true
      }
    })

    expect(wrapper.classes()).toContain(`is-round`)
  })

  it('set button circle by prop type', () => {
    const wrapper = mount(Button, {
      props: {
        circle: true
      }
    })

    expect(wrapper.classes()).toContain(`is-circle`)
  })

  it('set button loading by prop loading', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper.classes()).toContain(`is-loading`)
  })

  describe('set button disabled', () => {
    it('by props.disabled', () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain(`is-disabled`)
      expect(wrapper.attributes()).toHaveProperty('disabled')
    })

    it('by elForm.disabled', () => {
      const wrapper = mount(Button, {
        global: {
          provide: {
            elForm: reactive({
              disabled: true
            })
          }
        }
      })

      expect(wrapper.classes()).toContain(`is-disabled`)
      expect(wrapper.attributes()).toHaveProperty('disabled')
    })
  })

  describe('set button icon', () => {
    it(' by props.icon', () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit'
        }
      })

      expect(wrapper.find('.el-icon-edit').exists()).toBe(true)
    })

    it("don't show icon when loading eq true", () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit',
          loading: true
        }
      })

      expect(wrapper.find('.el-icon-edit').exists()).toBe(false)
      expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
    })
  })

  it('set native-type by props.native-type', () => {
    const nativeType = 'reset'

    const wrapper = mount(Button, {
      props: {
        nativeType
      }
    })

    expect(wrapper.attributes('type')).toBe(nativeType)
  })
})
