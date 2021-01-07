import { mount } from '@vue/test-utils'
import Progress from '../src/Progress.vue'
import Color from '../../../../packages/color-picker/src/color'
import { merge } from 'lodash-es'
import { STATUS_SETTING } from '../src/props'

export const DEFAULT_PERCENTAGE = 85

export function initProgress(initProps) {
  const percentage = (initProps && initProps.percentage) || DEFAULT_PERCENTAGE
  const props = merge({ percentage }, initProps)
  return mount(Progress, { props })
}

export function assertSetBgColor(wrapper, color) {
  const rgb = fromHexToRgb(color)
  assertContainStyle(
    wrapper,
    '.el-progress-bar__inner',
    `background-color: ${rgb};`
  )
}

export function fromHexToRgb(hex) {
  const c = new Color()
  c.fromString(hex)
  const rgb = c.toRgb()
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function assertSetPercentage(wrapper, percentage) {
  expect(wrapper.get('.el-progress__text')).toHaveTextContent(`${percentage}%`)
  assertContainStyle(
    wrapper,
    '.el-progress-bar__inner',
    `width: ${percentage}%;`
  )
}

export function assertContainStyle(wrapper, selector, strStyle) {
  const elem = wrapper.find(selector)
  expect(elem.attributes().style).toBeDefined()
  expect(elem.attributes().style).toContain(strStyle)
}

export function assertNotContainStyle(wrapper, selector, strStyle) {
  const elem = wrapper.find(selector)
  expect(elem.attributes().style).not.toContain(strStyle)
}

export async function assertArcStyleOk(wrapper, percentage) {
  const percent = percentage || wrapper.props('percentage')
  await wrapper.setProps({ percentage: percent })
  const testArcs = { 50: '149.5', 0: '299.1', 85: '254.2', 25: '74.8' }
  const pathNew = wrapper.find('.el-progress-circle > svg > path:last-child')
  const pathAttrsNew = pathNew.attributes()
  expect(pathAttrsNew.style).toBe(
    `stroke-dasharray: ${testArcs[percent]}px, 299.1px; stroke-dashoffset: 0.0px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;`
  )
}

export function findSvgTrailPath(wrapper) {
  return wrapper.find('.el-progress-circle > svg > path:first-child')
}

export function findSvgArcPath(wrapper) {
  return wrapper.find('.el-progress-circle > svg > path:last-child')
}

export function assertSvgStrokeOk(wrapper, status) {
  expect(wrapper.props('status')).toBe(status)
  const svgArcPath = findSvgArcPath(wrapper)
  expect(svgArcPath.attributes()['stroke']).toBe(STATUS_SETTING[status].color)
}

export function assertIconClassOk(wrapper, status) {
  const icon = wrapper.find('.el-progress__text > i')
  expect(icon).toHaveClass(STATUS_SETTING[status]['arcIconClass'])
}
