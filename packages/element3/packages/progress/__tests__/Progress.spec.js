import { mount } from '@vue/test-utils'
import Progress from '../Progress.vue'
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

  describe('props', () => {
    it('percentage', async () => {
      const wrapper = mount(Progress, {
        props: {
          percentage: 58
        }
      })
      await wrapper.setProps({ percentage: 28 })
      testPercentage(wrapper, 28)
    })
  })
})

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
