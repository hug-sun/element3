import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Progress from '../Progress.vue'

describe('Progress.vue', () => {
  test('render test', () => {
    const wrapper = mount(Progress)

    expect(wrapper.find('.el-progress').exists()).toBe(true)
    expect(wrapper.find('.el-progress--line').exists()).toBe(true)
    expect(wrapper.find('.el-progress__text').exists()).toBe(true)
  })

  test('type props', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle' },
    })

    expect(wrapper.find('.el-progress--line').exists()).toBe(false)
    expect(wrapper.find('.el-progress--circle').exists()).toBe(true)
  })

  test('status props', () => {
    const wrapper = mount(Progress, {
      props: { status: 'success' },
    })

    expect(wrapper.find('.el-progress--line').exists()).toBe(true)
    expect(wrapper.find('.el-progress').classes()).toContain('is-success')
    expect(wrapper.find('i').classes()).toContain('el-icon-success')
    expect(wrapper.find('.el-progress__text').text()).toBe('')
  })

  test('color props', () => {
    const wrapper = mount(Progress, {
      props: { color: 'purple' },
    })

    expect(wrapper.find('.el-progress-bar__inner').attributes('style')).toContain('color: purple')
  })

  test('processing props', () => {
    const wrapper = mount(Progress, {
      props: { processing: true },
    })

    expect(wrapper.find('.el-progress').classes()).toContain('is-processing')
  })

  test('percentage props', async () => {
    const wrapper = mount(Progress, {
      props: { percentage: 50 },
    })

    expect(wrapper.find('.el-progress-bar__inner').attributes('style')).toContain('width: 50%')

    await wrapper.setProps({ percentage: 100 })

    expect(wrapper.find('.el-progress-bar__inner').attributes('style')).toContain('width: 100%')
  })

  test('indicator-placment props', () => {
    const wrapper = mount(Progress, {
      props: { indicatorPlacement: 'inside' },
    })

    expect(wrapper.find('.el-progress').classes()).toContain('el-progress--text-inside')
    expect(wrapper.find('.el-progress-bar__innerText').exists()).toBe(true)
    expect(wrapper.find('el-progress__text').exists()).toBe(false)
  })

  test('show-indicator props', () => {
    const wrapper = mount(Progress, {
      props: { showIndicator: false },
    })

    expect(wrapper.find('el-progress__text').exists()).toBe(false)
  })

  test('height props', () => {
    const wrapper = mount(Progress, {
      props: { height: 100 },
    })

    expect(wrapper.find('.el-progress-bar__outer').attributes('style')).toContain('height: 100px')
  })
})
