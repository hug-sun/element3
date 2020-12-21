import { mount } from '@vue/test-utils'
import Progress from '../src/Progress.vue'
import Color from '../../../../packages/color-picker/src/color'
import { merge } from 'lodash'

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
  assertContainText(wrapper, '.el-progress__text', `${percentage}%`)
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

export function assertContainText(wrapper, selector, text) {
  expect(wrapper.find(selector).text()).toContain(text)
}

export function assertHasClass(elem, className) {
  expect(elem.classes().includes(className)).toBeTruthy()
}

export function assertNotHasClass(elem, className) {
  expect(elem.classes().includes(className)).toBeFalsy()
}

export function assertExistsElem(wrapper, selector) {
  expect(wrapper.find(selector).exists()).toBeTruthy()
}
export function assertNoElem(wrapper, selector) {
  expect(wrapper.find(selector).exists()).toBeFalsy()
}
