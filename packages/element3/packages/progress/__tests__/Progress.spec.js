import { mount } from '@vue/test-utils'
import Progress from '../Progress.vue'

describe('Progress.vue', () => {
  it('should create default Progress component and HTML structure', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 55
      }
    })
    hasClass(wrapper, 'el-progress')
    hasClass(wrapper, 'el-progress--line')

    existsElem(wrapper, '.el-progress > .el-progress-bar')
    existsElem(wrapper, '.el-progress > .el-progress__text')
    existsElem(wrapper, '.el-progress-bar > .el-progress-bar__outer')
    existsElem(wrapper, '.el-progress-bar__outer .el-progress-bar__inner')

    containText(wrapper, '.el-progress__text', '55%')
    expect(wrapper.find('.el-progress-bar__inner').attributes().style).toBe(
      'width: 55%;'
    )
  })
})
function containText(wrapper, selector, text) {
  expect(wrapper.find(selector).text()).toContain(text)
}

function hasClass(elem, className) {
  expect(elem.classes().includes(className)).toBeTruthy()
}

function existsElem(wrapper, selector) {
  expect(wrapper.find(selector).exists()).toBeTruthy()
}
