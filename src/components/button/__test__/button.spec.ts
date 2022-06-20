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

  // primary / success / warning / danger / info / text
  it('type 渲染不同类型按钮，正常、警告、错误', () => {
    const { getByRole } = render(Button, {
      props: {
        type: 'primary',
      },
    })
    expect(getByRole('button')).toHaveClass('el-button--primary')
  })

  // 'medium' | 'small' | 'mini';
  it('根据size 渲染按钮大小', () => {
    const { getByRole } = render(Button, {
      props: {
        size: 'medium',
      },
    })
    expect(getByRole('button')).toHaveClass('el-button--medium')
  })

  // 根据round 是否这种圆角
  it('props round:true 按钮渲染有圆角', () => {
    const { getByRole } = render(Button, {
      props: {
        round: true,
      },
    })
    expect(getByRole('button')).toHaveClass('is-round')
  })

  it('props round:false 按钮渲染无圆角', () => {
    const { getByRole } = render(Button, {
      props: {
        round: false,
      },
    })
    expect(getByRole('button')).not.toHaveClass('is-round')
  })

  // 渲染朴素按钮
  it('渲染朴素按钮 plain true', () => {
    const { getByRole } = render(Button, {
      props: {
        plain: true,
      },
    })
    expect(getByRole('button')).toHaveClass('is-plain')
  })
  it('渲染朴素按钮 plain', () => {
    const { getByRole } = render(Button, {
      props: {
        plain: false,
      },
    })
    expect(getByRole('button')).not.toHaveClass('is-plain')
  })
})
