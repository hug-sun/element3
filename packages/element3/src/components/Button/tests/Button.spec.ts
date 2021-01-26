import Button from '../src/Button.vue'
import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import { setupGlobalOptions } from '../../../composables/globalConfig'

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

    expect(wrapper).toHaveTextContent(content)
  })

  it('autofocus', () => {
    const wrapper = mount({
      template: '<Button autofocus></Button>',
      components: {
        Button
      }
    })

    expect(wrapper).toHaveAttribute('autofocus')
  })

  describe('set button size', () => {
    it('by props.size', async () => {
      const size = 'small'

      const wrapper = mount(Button, {
        props: {
          size
        }
      })

      expect(wrapper).toHaveClass(`el-button--${size}`)

      await wrapper.setProps({
        size: 'mini'
      })
      expect(wrapper).toHaveClass(`el-button--mini`)
    })

    it('by elFormItem.elFormItemSize', async () => {
      const size = 'small'

      const elFormItem = reactive({
        elFormItemSize: size
      })

      const wrapper = mount(Button, {
        props: {
          size: ''
        },
        global: {
          provide: {
            elFormItem
          }
        }
      })

      expect(wrapper).toHaveClass(`el-button--${size}`)
      elFormItem.elFormItemSize = 'mini'
      await nextTick()
      expect(wrapper).toHaveClass(`el-button--mini`)
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

      expect(wrapper).toHaveClass(`el-button--${size}`)
    })
  })

  it('set button type ', () => {
    const type = 'success'

    const wrapper = mount(Button, {
      props: {
        type
      }
    })

    expect(wrapper).toHaveClass(`el-button--${type}`)
  })

  it('set button plain ', async () => {
    const wrapper = mount(Button, {
      props: {
        plain: true
      }
    })

    expect(wrapper).toHaveClass('is-plain')

    await wrapper.setProps({
      plain: false
    })

    expect(wrapper).not.toHaveClass('is-plain')
  })
  it('set button round ', async () => {
    const wrapper = mount(Button, {
      props: {
        round: true
      }
    })

    expect(wrapper).toHaveClass('is-round')

    await wrapper.setProps({
      round: false
    })

    expect(wrapper).not.toHaveClass('is-round')
  })

  it('set button circle ', async () => {
    const wrapper = mount(Button, {
      props: {
        circle: true
      }
    })

    expect(wrapper).toHaveClass('is-circle')

    await wrapper.setProps({
      circle: false
    })

    expect(wrapper).not.toHaveClass('is-circle')
  })

  it('set button loading ', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper).toHaveClass('is-loading')

    await wrapper.setProps({
      loading: false
    })

    expect(wrapper).not.toHaveClass('is-loading')
  })

  describe('set button disabled', () => {
    it('by props.disabled', async () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expect(wrapper).toHaveClass('is-disabled')
      expect(wrapper).toHaveAttribute('disabled')

      await wrapper.setProps({
        disabled: false
      })

      expect(wrapper).not.toHaveClass('is-disabled')
      expect(wrapper).not.toHaveAttribute('disabled')
    })

    it('by elForm.disabled', async () => {
      const elForm = reactive({
        disabled: true
      })

      const wrapper = mount(Button, {
        global: {
          provide: {
            elForm
          }
        }
      })

      expect(wrapper).toHaveClass('is-disabled')
      expect(wrapper).toHaveAttribute('disabled')

      elForm.disabled = false
      await nextTick()

      expect(wrapper).not.toHaveClass('is-disabled')
      expect(wrapper).not.toHaveAttribute('disabled')
    })
  })

  describe('set button icon', () => {
    it(' by props.icon', () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit'
        }
      })

      expect(wrapper.find('.el-icon-edit')).toBeExist()
    })

    it("don't show icon when loading eq true", () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit',
          loading: true
        }
      })

      expect(wrapper.find('.el-icon-edit')).not.toBeExist()
      expect(wrapper.find('.el-icon-loading')).toBeExist()
    })
  })

  it('set native-type ', () => {
    const nativeType = 'reset'

    const wrapper = mount(Button, {
      props: {
        nativeType
      }
    })

    expect(wrapper).toHaveAttribute('type', nativeType)
  })
})
