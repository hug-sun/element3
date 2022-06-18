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
    const { getByRole } = render(Comp)
    expect(getByRole('a')).toHaveClass(`el-link--${type}`)
  })

  it('set the underline, link displays the corresponding style', () => {
    const underline = true
    const { getByRole } = render(Link, {
      props: {
        underline,
      },
    })
    expect(getByRole('a')).toHaveClass('is-underline')
  })
})
