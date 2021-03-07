import Button from '../src/Button.vue'
import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import { setupGlobalOptions } from '../../../composables/globalConfig'
import { render } from '@testing-library/vue'
import {
  expectHaveClass,
  expectNotHaveClass,
  expectHaveAttribute,
  expectNotHaveAttribute,
  expectToBeExist,
  expectNotToBeExist
} from '../../../../tests/helper'

describe('Button.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Button)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should show content', () => {
    const content = 'foo'

    const { getByText } = render(Button, {
      slots: {
        default: content
      }
    })

    expect(getByText('foo')).toBeInTheDocument()
  })

  it('autofocus', () => {
    const wrapper = mount({
      template: '<Button autofocus></Button>',
      components: {
        Button
      }
    })

    expectHaveAttribute(wrapper, 'autofocus')
  })

  describe('set button size', () => {
    it('by props.size', async () => {
      const size = 'small'

      const wrapper = mount(Button, {
        props: {
          size
        }
      })

      expectHaveClass(wrapper, `el-button--${size}`)

      await wrapper.setProps({
        size: 'mini'
      })
      expectHaveClass(wrapper, `el-button--mini`)
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

      expectHaveClass(wrapper, `el-button--${size}`)
      elFormItem.elFormItemSize = 'mini'
      await nextTick()
      expectHaveClass(wrapper, `el-button--mini`)
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

      expectHaveClass(wrapper, `el-button--${size}`)
    })
  })

  it('set button type ', () => {
    const type = 'success'

    const wrapper = mount(Button, {
      props: {
        type
      }
    })

    expectHaveClass(wrapper, `el-button--${type}`)
  })

  it('set button plain ', async () => {
    const wrapper = mount(Button, {
      props: {
        plain: true
      }
    })

    expectHaveClass(wrapper, `is-plain`)

    await wrapper.setProps({
      plain: false
    })

    expectNotHaveClass(wrapper, `is-plain`)
  })
  it('set button round ', async () => {
    const wrapper = mount(Button, {
      props: {
        round: true
      }
    })

    expectHaveClass(wrapper, `is-round`)

    await wrapper.setProps({
      round: false
    })

    expectNotHaveClass(wrapper, 'is-round')
  })

  it('set button circle ', async () => {
    const wrapper = mount(Button, {
      props: {
        circle: true
      }
    })

    expectHaveClass(wrapper, `is-circle`)

    await wrapper.setProps({
      circle: false
    })

    expectNotHaveClass(wrapper, `is-circle`)
  })

  it('set button loading ', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expectHaveClass(wrapper, `is-loading`)

    await wrapper.setProps({
      loading: false
    })

    expectNotHaveClass(wrapper, `is-loading`)
  })

  describe('set button disabled', () => {
    it('by props.disabled', async () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expectHaveClass(wrapper, `is-disabled`)
      expectHaveAttribute(wrapper, 'disabled')

      await wrapper.setProps({
        disabled: false
      })

      expectNotHaveClass(wrapper, `is-disabled`)
      expectNotHaveAttribute(wrapper, 'disabled')
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

      expectHaveClass(wrapper, `is-disabled`)
      expectHaveAttribute(wrapper, 'disabled')

      elForm.disabled = false
      await nextTick()

      expectNotHaveClass(wrapper, `is-disabled`)
      expectNotHaveAttribute(wrapper, 'disabled')
    })
  })

  describe('set button icon', () => {
    it(' by props.icon', () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit'
        }
      })

      expectToBeExist(wrapper.find('.el-icon-edit'))
    })

    it("don't show icon when loading eq true", () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-edit',
          loading: true
        }
      })

      expectNotToBeExist(wrapper.find('.el-icon-edit'))
      expectToBeExist(wrapper.find('.el-icon-loading'))
    })
  })

  it('set native-type ', () => {
    const nativeType = 'reset'

    const wrapper = mount(Button, {
      props: {
        nativeType
      }
    })

    expectHaveAttribute(wrapper, 'type', nativeType)
  })
})
