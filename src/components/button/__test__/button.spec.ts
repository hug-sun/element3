import { describe } from 'vitest'
import { render } from '@testing-library/vue'
import Button from '../Button.vue'

describe('Button.vue', () => {
  it('用户可以通过 slot 的方式，定义组件的内容', () => {
    const { getByText } = render(Button, {
      slots: {
        default: '默认按钮',
      },
    })
    expect(getByText('默认按钮')).toBeInTheDocument()
  })

  // type: primary | success | warning | danger | info | text
  it('set button type', () => {
    const type = 'primary'
    const { getByRole } = render(Button, {
      props: {
        type,
      },
    })
    expect(getByRole('button')).toHaveClass(`el-button--${type}`)
  })

  // size: medium | small  | mini;
  it('set button size', () => {
    const size = 'medium'
    const { getByRole } = render(Button, {
      props: {
        size,
      },
    })
    expect(getByRole('button')).toHaveClass(`el-button--${size}`)
  })

  it('set button round', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        round: true,
      },
    })
    expect(getByRole('button')).toHaveClass('is-round')

    await rerender({
      round: false,
    })
    expect(getByRole('button')).not.toHaveClass('is-round')
  })

  it('set button plain', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        plain: true,
      },
    })
    expect(getByRole('button')).toHaveClass('is-plain')

    await rerender({
      plain: false,
    })

    expect(getByRole('button')).not.toHaveClass('is-plain')
  })

  it('set button circle', async () => {
    const { getByRole, rerender } = render(Button, {
      props: {
        circle: true,
      },
    })
    expect(getByRole('button')).toHaveClass('is-circle')

    await rerender({
      circle: false,
    })

    expect(getByRole('button')).not.toHaveClass('is-circle')
  })

  // native type: button | reset | submit
  it('set button native type', () => {
    const { getByRole } = render(Button, {
      props: {
        nativeType: 'submit',
      },
    })
    expect(getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
