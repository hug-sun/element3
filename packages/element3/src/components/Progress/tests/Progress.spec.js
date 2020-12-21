import { mount } from '@vue/test-utils'
import Progress from '../src/Progress.vue'
import { sortByPercentage } from '../src/props'
import {
  assertHasClass,
  assertNotHasClass,
  assertExistsElem,
  assertNoElem,
  assertSetPercentage,
  assertSetBgColor,
  assertContainText,
  assertNotContainStyle
} from './test-helper'

describe('Progress.vue', () => {
  it('should create default Progress component and HTML structure', () => {
    const percentage = 55
    const wrapper = mount(Progress, {
      props: { percentage }
    })
    assertHasClass(wrapper, 'el-progress')
    assertHasClass(wrapper, 'el-progress--line')
    assertNotHasClass(wrapper, 'is-undefined')

    assertExistsElem(wrapper, '.el-progress > .el-progress-bar')
    assertExistsElem(wrapper, '.el-progress > .el-progress__text')
    assertExistsElem(wrapper, '.el-progress-bar > .el-progress-bar__outer')
    assertExistsElem(wrapper, '.el-progress-bar__outer .el-progress-bar__inner')

    assertSetPercentage(wrapper, percentage)

    expect(wrapper.find('.temptest').text()).toBe('')
  })

  describe('line type progress props:', () => {
    it('percentage', async () => {
      const percentage = 58
      const wrapper = mount(Progress, {
        props: { percentage }
      })
      assertSetPercentage(wrapper, 58)
      await wrapper.setProps({ percentage: 28 })
      assertSetPercentage(wrapper, 28)
    })

    it('percentage validator', async () => {
      const percentage = 158
      const wrapper = mount(Progress, {
        props: { percentage }
      })
      assertSetPercentage(wrapper, 100)
      await wrapper.setProps({ percentage: -28 })
      assertSetPercentage(wrapper, 0)
    })

    it('format', () => {
      const format = (p) => (p === 100 ? '满' : `${p}%`)
      const percentage = 100
      const props = { percentage, format }
      const wrapper = mount(Progress, { props })
      assertContainText(wrapper, '.el-progress__text', '满')
    })

    it('color string', async () => {
      const color1 = '#409eff'
      const percentage = 30
      const props = { percentage, color: color1 }
      const wrapper = mount(Progress, { props })
      assertSetBgColor(wrapper, color1)
      const color2 = '#336699'
      await wrapper.setProps({ color: color2 })
      assertSetBgColor(wrapper, color2)
      const color3 = ''
      await wrapper.setProps({ color: color3 })
      assertNotContainStyle(
        wrapper,
        '.el-progress-bar__inner',
        'background-color'
      )
    })

    it('color function', async () => {
      const color = (percentage) => {
        if (percentage < 30) {
          return '#33ff99'
        } else if (percentage < 70) {
          return '#ff9900'
        } else {
          return '#993300'
        }
      }
      const p1 = 20
      const props = { percentage: p1, color }
      const wrapper = mount(Progress, { props })

      assertSetBgColor(wrapper, color(p1))

      const p2 = 50
      await wrapper.setProps({ percentage: p2 })

      assertSetBgColor(wrapper, color(p2))

      const p3 = 80
      await wrapper.setProps({ percentage: p3 })

      assertSetBgColor(wrapper, color(p3))
    })

    it('color string array', async () => {
      const colors = ['#336699', '#339966', '#996633']
      const percentage = 15
      const props = { percentage, color: colors }
      const wrapper = mount(Progress, { props })
      assertSetBgColor(wrapper, colors[0])

      await wrapper.setProps({ percentage: 0 })
      assertSetBgColor(wrapper, colors[0])
      await wrapper.setProps({ percentage: 10 })
      assertSetBgColor(wrapper, colors[0])
      await wrapper.setProps({ percentage: 35 })
      assertSetBgColor(wrapper, colors[1])
      await wrapper.setProps({ percentage: 65 })
      assertSetBgColor(wrapper, colors[1])
      await wrapper.setProps({ percentage: 67 })
      assertSetBgColor(wrapper, colors[2])
      await wrapper.setProps({ percentage: 100 })
      assertSetBgColor(wrapper, colors[2])
    })

    it('color object array', () => {
      const colors = [
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 }
      ]
      colors.sort(sortByPercentage)
      expect(colors[0].percentage).toBe(20)
      expect(colors[3].percentage).toBe(80)
      expect(colors[4].percentage).toBe(100)
      const percentage = 85
      const props = { percentage, color: colors }
      const wrapper = mount(Progress, { props })
      expect(wrapper).toBeDefined()
      assertSetBgColor(wrapper, colors[4].color)
    })

    it('status add "is-xxx" class', async () => {
      const percentage = 85
      const status = 'success'
      const props = { percentage, status }
      const wrapper = mount(Progress, { props })
      assertHasClass(wrapper, 'is-success')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-circle-check')
      await wrapper.setProps({ status: 'exception' })
      assertHasClass(wrapper, 'is-exception')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-circle-close')
      await wrapper.setProps({ status: 'warning' })
      assertHasClass(wrapper, 'is-warning')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-warning')

      await wrapper.setProps({ status: 'error' })
      assertNotHasClass(wrapper, 'is-error')
    })

    it('show-text', async () => {
      const percentage = 85
      const props = { percentage }
      const wrapper = mount(Progress, { props })
      assertExistsElem(wrapper, '.el-progress__text')
      assertContainText(wrapper, '.el-progress__text', '85%')

      await wrapper.setProps({ showText: false })
      assertNoElem(wrapper, '.el-progress__text')
    })
  })
})
