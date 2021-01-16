import Card from '../src/Card.vue'
import { mount } from '@vue/test-utils'

describe('Card.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Card)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('should show content', () => {
    const content = 'body'

    const wrapper = mount(Card, {
      slots: {
        default: content
      }
    })

    expect(wrapper).toHaveTextContent(content)
  })

  it('shadow', async () => {
    const wrapper = mount(Card)

    expect(wrapper).toHaveClass(`is-always-shadow`)

    await wrapper.setProps({ shadow: 'hover' })
    expect(wrapper).toHaveClass(`is-hover-shadow`)

    await wrapper.setProps({ shadow: 'never' })
    expect(wrapper).toHaveClass(`is-never-shadow`)

    await wrapper.setProps({ shadow: 'always' })
    expect(wrapper).toHaveClass(`is-always-shadow`)
  })

  it('header props', async () => {
    const content = 'header'
    const wrapper = mount(Card)

    await wrapper.setProps({ header: content })
    expect(wrapper.find('.el-card__header')).toHaveTextContent(content)
  })

  it('header slot', () => {
    const content = 'header'

    const wrapper = mount(Card, {
      slots: {
        header: content
      }
    })

    expect(wrapper.find('.el-card__header')).toHaveTextContent(content)
  })

  it('body-style', () => {
    const wrapper = mount(Card, {
      props: {
        bodyStyle: {
          padding: '30px'
        }
      }
    })

    expect(wrapper.find('.el-card__body')).toHaveAttribute(
      'style',
      'padding: 30px;'
    )
  })
})
