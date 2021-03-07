import Card from '../src/Card.vue'
import { mount } from '@vue/test-utils'
import {
  expectHaveAttribute,
  expectHaveClass,
  expectHaveTextContent
} from '../../../../tests/helper'

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

    expectHaveTextContent(wrapper, content)
  })

  it('shadow', async () => {
    const wrapper = mount(Card)

    expectHaveClass(wrapper, 'is-always-shadow')

    await wrapper.setProps({ shadow: 'hover' })
    expectHaveClass(wrapper, 'is-hover-shadow')

    await wrapper.setProps({ shadow: 'never' })
    expectHaveClass(wrapper, 'is-never-shadow')

    await wrapper.setProps({ shadow: 'always' })
    expectHaveClass(wrapper, 'is-always-shadow')
  })

  it('header props', async () => {
    const content = 'header'
    const wrapper = mount(Card)

    await wrapper.setProps({ header: content })
    expectHaveTextContent(wrapper.find('.el-card__header'), content)
  })

  it('header slot', () => {
    const content = 'header'

    const wrapper = mount(Card, {
      slots: {
        header: content
      }
    })

    expectHaveTextContent(wrapper.find('.el-card__header'), content)
  })

  it('body-style', () => {
    const wrapper = mount(Card, {
      props: {
        bodyStyle: {
          padding: '30px'
        }
      }
    })

    expectHaveAttribute(
      wrapper.find('.el-card__body'),
      'style',
      'padding: 30px;'
    )
  })
})
