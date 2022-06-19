import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import Link from '../Link.vue'

describe('Link.vue', () => {
  it('should show content', () => {
    const content = 'foo'
    const { getByText } = render(Link, {
      slots: {
        default: content,
      },
    })
    expect(getByText('foo')).toBeInTheDocument()
  })

  it('set the type, link displays the corresponding style', () => {
    const type = 'primary'
    const Comp = {
      template: `<Link type="${type}"></Link>`,
      components: {
        Link,
      },
    }
    const { container } = render(Comp)
    expect(container.querySelector('a')).toHaveClass(`el-link--${type}`)
  })

  it('set the underline, link displays the corresponding style', () => {
    const underline = true
    const { container } = render(Link, {
      props: {
        underline,
      },
    })
    expect(container.querySelector('a')).toHaveClass('is-underline')
  })

  it('set the disabled, link displays the corresponding style', () => {
    const disabled = true
    const { container } = render(Link, {
      props: {
        disabled,
      },
    })
    expect(container.querySelector('a')).toHaveClass('is-disabled')
  })

  it('set the href', () => {
    const href = 'https://e3.shengxinjing.cn/'
    const { container } = render(Link, {
      props: {
        href,
      },
    })
    expect(container.querySelector('a')).toHaveAttribute('href', href)
  })
})
