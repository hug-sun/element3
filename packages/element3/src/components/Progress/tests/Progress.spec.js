import { DEFAULT_COLOR, sortByPercentage } from '../src/props'
// import { toHa } from "jest-vtu";

import {
  initProgress,
  assertExistsElem,
  assertNoElem,
  assertSetPercentage,
  assertSetBgColor,
  assertContainText,
  assertNotContainStyle,
  assertContainStyle,
  assertArcStyleOk,
  findSvgTrailPath,
  findSvgArcPath,
  assertSvgStrokeOk
} from './test-helper'

describe('Progress.vue', () => {
  it('should create default Progress component and HTML structure', () => {
    const percentage = 55
    const wrapper = initProgress({ percentage })
    expect(wrapper).toHaveClass('el-progress')
    expect(wrapper).toHaveClass('el-progress--line')
    expect(wrapper).not.toHaveClass('is-undefined')

    assertExistsElem(wrapper, '.el-progress > .el-progress-bar')
    assertExistsElem(wrapper, '.el-progress > .el-progress__text')
    assertExistsElem(wrapper, '.el-progress-bar > .el-progress-bar__outer')
    assertExistsElem(wrapper, '.el-progress-bar__outer .el-progress-bar__inner')

    assertSetPercentage(wrapper, percentage)
  })

  describe('line type progress:', () => {
    it('percentage', async () => {
      const percentage = 58
      const wrapper = initProgress({ percentage })
      assertSetPercentage(wrapper, 58)
      await wrapper.setProps({ percentage: 28 })
      assertSetPercentage(wrapper, 28)
    })

    it('percentage validator', async () => {
      const percentage = 158
      const wrapper = initProgress({ percentage })
      assertSetPercentage(wrapper, 100)
      await wrapper.setProps({ percentage: -28 })
      assertSetPercentage(wrapper, 0)
    })

    it('format', () => {
      const format = (p) => (p === 100 ? '满' : `${p}%`)
      const percentage = 100
      const props = { percentage, format }
      const wrapper = initProgress(props)
      assertContainText(wrapper, '.el-progress__text', '满')
    })

    it('color string', async () => {
      const color1 = '#409eff'
      const percentage = 30
      const props = { percentage, color: color1 }
      const wrapper = initProgress(props)
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
      const wrapper = initProgress(props)

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
      const wrapper = initProgress(props)
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

      const wrapper = initProgress({ color: colors })
      expect(wrapper).toBeDefined()
      assertSetBgColor(wrapper, colors[4].color)
    })

    it('status add "is-xxx" class', async () => {
      const wrapper = initProgress({ status: 'success' })
      expect(wrapper).toHaveClass('is-success')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-circle-check')
      await wrapper.setProps({ status: 'exception' })
      expect(wrapper).toHaveClass('is-exception')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-circle-close')
      await wrapper.setProps({ status: 'warning' })
      expect(wrapper).toHaveClass('is-warning')
      assertExistsElem(wrapper, '.el-progress__text > i.el-icon-warning')

      await wrapper.setProps({ status: 'error' })
      expect(wrapper).not.toHaveClass('is-error')
    })

    it('show-text', async () => {
      const wrapper = initProgress()
      assertExistsElem(wrapper, '.el-progress__text')
      assertContainText(wrapper, '.el-progress__text', '85%')

      await wrapper.setProps({ showText: false })
      assertNoElem(wrapper, '.el-progress__text')
      assertNoElem(wrapper, '.el-progress-bar__innerText')
      expect(wrapper).toHaveClass('el-progress--without-text')
    })

    it('strokeWidth', async () => {
      const wrapper = initProgress({ strokeWidth: 30 })
      assertContainStyle(
        wrapper,
        '.el-progress-bar > .el-progress-bar__outer',
        'height: 30px'
      )
      await wrapper.setProps({ strokeWidth: 20 })
      assertContainStyle(
        wrapper,
        '.el-progress-bar > .el-progress-bar__outer',
        'height: 20px'
      )
    })

    it('textInside', async () => {
      const wrapper = initProgress()
      expect(wrapper).not.toHaveClass('el-progress--text-inside')
      assertExistsElem(
        wrapper,
        '.el-progress-bar__outer > .el-progress-bar__inner'
      )
      assertNoElem(wrapper, '.el-progress-bar__innerText')

      await wrapper.setProps({ textInside: true })
      expect(wrapper).toHaveClass('el-progress--text-inside')
      assertExistsElem(wrapper, '.el-progress-bar__innerText')
      assertNoElem(wrapper, '.el-progress__text')
    })
  })

  describe('circle type progress', () => {
    it('type prop', () => {
      const wrapper = initProgress({ type: 'circle' })
      expect(wrapper).not.toHaveClass('el-progress--line')
      expect(wrapper).toHaveClass('el-progress--circle')
      assertNoElem(wrapper, '.el-progress-bar')
      assertExistsElem(wrapper, '.el-progress-circle')
    })

    it('circle html and svg etc', () => {
      const wrapper = initProgress({ type: 'circle' })
      assertExistsElem(wrapper, '.el-progress-circle > svg')
      const circle = wrapper.find('.el-progress-circle')
      expect(circle.attributes().style).toBe('width: 126px; height: 126px;')
      const svg = wrapper.find('.el-progress-circle > svg')
      expect(svg.attributes().viewBox).toBe('0 0 100 100')
      const svgTrailPath = findSvgTrailPath(wrapper)
      expect(svgTrailPath).toHaveClass('el-progress-circle__track')
      const svgArcPath = findSvgArcPath(wrapper)
      expect(svgArcPath).toHaveClass('el-progress-circle__path')

      const d = `M 50 50 m 0 -47.6 a 47.6 47.6 0 1 1 0 95.2 a 47.6 47.6 0 1 1 0 -95.2`
      const trailAttrs = svgTrailPath.attributes()
      expect(trailAttrs.d).toContain(d)
      expect(trailAttrs['stroke-width']).toBe('4.8')
      expect(trailAttrs.style).toBe(
        'stroke-dasharray: 299.1px, 299.1px; stroke-dashoffset: 0px;'
      )
      assertArcStyleOk(wrapper, 85)
    })

    it('percentage', async () => {
      const wrapper = initProgress({ type: 'circle', percentage: 25 })
      await assertArcStyleOk(wrapper)
      await assertArcStyleOk(wrapper, 50)
    })

    it('strokeLinecap', async () => {
      const wrapper = initProgress({ type: 'circle' })
      const svgArcPath = findSvgArcPath(wrapper)
      expect(svgArcPath.attributes()['stroke-linecap']).toBe('round')

      await wrapper.setProps({ strokeLinecap: 'butt' })
      expect(svgArcPath.attributes()['stroke-linecap']).toBe('butt')
      await wrapper.setProps({ strokeLinecap: 'square' })
      expect(svgArcPath.attributes()['stroke-linecap']).toBe('square')
    })

    it.only('color and status', async () => {
      const wrapper = initProgress({ type: 'circle' })
      const svgArcPath = findSvgArcPath(wrapper)
      expect(svgArcPath.attributes()['stroke']).toBe(DEFAULT_COLOR)

      let status = 'success'
      await wrapper.setProps({ status: 'success' })
      expect(wrapper.props('status')).toBe(status)
      expect(svgArcPath.attributes()['stroke']).toBe('#456456')
      assertSvgStrokeOk(wrapper, status)

      status = 'warning'
      await wrapper.setProps({ status })
      assertSvgStrokeOk(wrapper, status)

      status = 'exception'
      await wrapper.setProps({ status })
      assertSvgStrokeOk(wrapper, status)
    })
  })
})
