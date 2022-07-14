import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Empty from '../Empty.vue'

const TEXT = 'hello world'
const EMPTY_TEXT = 'No Data'

describe('Empty.vue', () => {
  test('render test', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.el-empty__image').exists()).toBe(true)
    expect(wrapper.find('.el-empty__description').exists()).toBe(true)
    expect(wrapper.find('.el-empty__bottom').exists()).toBe(false)
  })

  test('should render description props', () => {
    const wrapper = mount(Empty, {
      props: {
        description: TEXT,
      },
    })
    expect(wrapper.find('.el-empty__description').text()).toEqual(TEXT)
  })

  test('if no description, should show emptyText', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.el-empty__description').text()).toEqual(EMPTY_TEXT)
  })

  test('should render image props', () => {
    const wrapper = mount(Empty, {
      props: {
        image: TEXT,
      },
    })
    expect(wrapper.find('.el-empty__image img').exists()).toBe(true)
  })

  test('should render imageSize props', async () => {
    const wrapper = mount(Empty, {
      props: {
        imageSize: 500,
      },
    })
    expect(wrapper.find('.el-empty__image').attributes('style')).toContain(
      'width: 500px',
    )
  })

  test('should render default slots', async () => {
    const wrapper = mount(Empty, {
      slots: {
        default: () => TEXT,
      },
    })
    expect(wrapper.find('.el-empty__bottom').text()).toEqual(TEXT)
  })
})
