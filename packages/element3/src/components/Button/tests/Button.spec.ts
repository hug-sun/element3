import Button from '../src/Button.vue'
import { reactive } from 'vue'
import { setupGlobalOptions } from '../../../composables/globalConfig'
import { render, waitFor } from '@testing-library/vue'

describe('Button.vue', () => {
  it('snapshot', () => {
    const { baseElement } = render(Button)
    expect(baseElement).toMatchSnapshot()
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
    const Comp = {
      template: '<Button autofocus></Button>',
      components: {
        Button
      }
    }

    const { getByRole } = render(Comp)

    expect(getByRole('button')).toHaveAttribute('autofocus')
  })

  describe('set button size', () => {
    it('by props.size', async () => {
      const { getByRole, rerender } = render(Button, {
        props: {
          size: 'small'
        }
      })

      expect(getByRole('button')).toHaveClass('el-button--small')

      await rerender({
        size: 'mini'
      })

      expect(getByRole('button')).toHaveClass('el-button--mini')
    })

    it('by elFormItem.elFormItemSize', async () => {
      const size = 'small'

      const elFormItem = reactive({
        elFormItemSize: size
      })

      const { getByRole } = render(Button, {
        props: {
          size: ''
        },
        global: {
          provide: {
            elFormItem
          }
        }
      })

      expect(getByRole('button')).toHaveClass(`el-button--${size}`)

      // update
      elFormItem.elFormItemSize = 'mini'
      await waitFor(() => {
        expect(getByRole('button')).toHaveClass(`el-button--mini`)
      })
    })

    it('by global config ', () => {
      const size = 'small'

      const { getByRole } = render(Button, {
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

      expect(getByRole('button')).toHaveClass(`el-button--${size}`)
    })
  })

  it('set button type ', () => {
    const type = 'success'
    const { getByRole } = render(Button, {
      props: {
        type
      }
    })

    expect(getByRole('button')).toHaveClass(`el-button--${type}`)
  })

  it('set button plain ', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        plain: true
      }
    })

    expect(getByRole('button')).toHaveClass('is-plain')

    // update
    await rerender({
      plain: false
    })

    expect(getByRole('button')).not.toHaveClass('is-plain')
  })
  it('set button round ', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        round: true
      }
    })

    expect(getByRole('button')).toHaveClass('is-round')

    // update
    await rerender({
      round: false
    })

    expect(getByRole('button')).not.toHaveClass('is-round')
  })

  it('set button circle ', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        circle: true
      }
    })

    expect(getByRole('button')).toHaveClass('is-circle')

    // update
    await rerender({
      circle: false
    })

    expect(getByRole('button')).not.toHaveClass('is-circle')
  })

  it('set button loading ', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        loading: true
      }
    })

    expect(getByRole('button')).toHaveClass('is-loading')

    // update
    await rerender({
      loading: false
    })

    expect(getByRole('button')).not.toHaveClass('is-loading')
  })

  describe('set button disabled', () => {
    it('by props.disabled', async () => {
      const { getByRole, rerender } = render(Button, {
        props: {
          disabled: true
        }
      })

      const buttonElement = getByRole('button')

      expect(buttonElement).toHaveClass('is-disabled')
      expect(buttonElement).toHaveAttribute('disabled')

      // update
      await rerender({
        disabled: false
      })

      expect(buttonElement).not.toHaveClass('is-disabled')
      expect(buttonElement).not.toHaveAttribute('disabled')
    })

    it('by elForm.disabled', async () => {
      const elForm = reactive({
        disabled: true
      })

      const { getByRole } = render(Button, {
        global: {
          provide: {
            elForm
          }
        }
      })

      expect(getByRole('button')).toHaveClass('is-disabled')
      expect(getByRole('button')).toHaveAttribute('disabled')

      // update
      elForm.disabled = false

      await waitFor(() => {
        expect(getByRole('button')).not.toHaveClass('is-disabled')
        expect(getByRole('button')).not.toHaveAttribute('disabled')
      })
    })
  })

  describe('set button icon', () => {
    it(' by props.icon', () => {
      const { getByTestId } = render(Button, {
        props: {
          icon: 'el-icon-edit'
        }
      })

      expect(getByTestId('icon')).toBeInTheDocument()
    })

    it("don't show icon when loading eq true", () => {
      const { getByTestId, queryByTestId } = render(Button, {
        props: {
          loading: true,
          icon: 'el-icon-edit'
        }
      })

      expect(queryByTestId('icon')).not.toBeInTheDocument()
      expect(getByTestId('loadingIcon')).toBeInTheDocument()
    })
  })

  it('set native-type ', () => {
    const nativeType = 'reset'

    const { getByRole } = render(Button, {
      props: {
        nativeType
      }
    })

    expect(getByRole('button')).toHaveAttribute('type', nativeType)
  })
})
