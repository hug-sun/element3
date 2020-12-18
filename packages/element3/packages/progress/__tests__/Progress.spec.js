import { mount } from '@vue/test-utils'
import Progress from '../Progress.vue'
import Color from '../../color-picker/src/color'
// import { getByTestId } from '@testing-library/jest-dom'

describe('Progress.vue', () => {
  it('should create default Progress component and HTML structure', () => {
    const percentage = 55
    const wrapper = mount(Progress, {
      props: { percentage }
    })
    hasClass(wrapper, 'el-progress')
    hasClass(wrapper, 'el-progress--line')

    existsElem(wrapper, '.el-progress > .el-progress-bar')
    existsElem(wrapper, '.el-progress > .el-progress__text')
    existsElem(wrapper, '.el-progress-bar > .el-progress-bar__outer')
    existsElem(wrapper, '.el-progress-bar__outer .el-progress-bar__inner')

    testPercentage(wrapper, percentage)

    // expect(getByTestId('temptest')).not.toBeEmptyDOMElement()
    expect(wrapper.find('.temptest').text()).toBe('')
  })

  describe('line type progress props:', () => {
    it('percentage', async () => {
      const percentage = 58
      const wrapper = mount(Progress, {
        props: { percentage }
      })
      await wrapper.setProps({ percentage: 28 })
      testPercentage(wrapper, 28)
    })

    it('format', () => {
      const format = (p) => (p === 100 ? '满' : `${p}%`)
      const percentage = 100
      const props = { percentage, format }
      const wrapper = mount(Progress, { props })
      containText(wrapper, '.el-progress__text', '满')
    })

    it('color string', async () => {
      const color1 = '#409eff'
      const percentage = 30
      const props = { percentage, color: color1 }
      const wrapper = mount(Progress, { props })
      const c1 = fromHexToRgb(color1)
      expect(c1).toBe('rgb(64, 158, 255)')
      containStyle(
        wrapper,
        '.el-progress-bar__inner',
        `background-color: ${c1};`
      )
      const color2 = '#336699'
      await wrapper.setProps({ color: color2 })
      const c2 = fromHexToRgb(color2)
      expect(c2).toBe('rgb(51, 102, 153)')
      containStyle(
        wrapper,
        '.el-progress-bar__inner',
        `background-color: ${c2};`
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

      const c1 = fromHexToRgb(color(p1))
      expect(c1).toBe('rgb(51, 255, 153)')

      containStyle(
        wrapper,
        '.el-progress-bar__inner',
        `background-color: ${c1};`
      )

      const p2 = 50
      await wrapper.setProps({ percentage: p2 })

      const c2 = fromHexToRgb(color(p2))
      expect(c2).toBe('rgb(255, 153, 0)')

      containStyle(
        wrapper,
        '.el-progress-bar__inner',
        `background-color: ${c2};`
      )

      const p3 = 80
      await wrapper.setProps({ percentage: p3 })

      const c3 = fromHexToRgb(color(p3))
      expect(c3).toBe('rgb(153, 51, 0)')

      containStyle(
        wrapper,
        '.el-progress-bar__inner',
        `background-color: ${c3};`
      )
    })
  })
})

function fromHexToRgb(hex) {
  const c = new Color()
  c.fromString(hex)
  const rgb = c.toRgb()
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

function testPercentage(wrapper, percentage) {
  containText(wrapper, '.el-progress__text', `${percentage}%`)
  containStyle(wrapper, '.el-progress-bar__inner', `width: ${percentage}%;`)
}

function containStyle(wrapper, selector, strStyle) {
  const elem = wrapper.find(selector)
  expect(elem.attributes().style).toBeDefined()
  expect(elem.attributes().style).toContain(strStyle)
}

function containText(wrapper, selector, text) {
  expect(wrapper.find(selector).text()).toContain(text)
}

function hasClass(elem, className) {
  expect(elem.classes().includes(className)).toBeTruthy()
}

function existsElem(wrapper, selector) {
  expect(wrapper.find(selector).exists()).toBeTruthy()
}
