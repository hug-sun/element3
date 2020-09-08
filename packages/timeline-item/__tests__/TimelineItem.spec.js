import TimelineItem from '../TimelineItem.vue'
import { mount } from '@vue/test-utils'
describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018-04-15'
      },
      slots: {
        default: '吃饭饭'
      }
    })

    expect(wrapper.find('.el-timeline-item__timestamp').text()).toBe(
      '2018-04-15'
    )
    expect(wrapper.find('.el-timeline-item__content').text()).toBe('吃饭饭')
  })
})

describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        hideTimestamp: true
      },
      slots: {
        default: 'aaa'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.el-timeline-item__content').text()).toBe('aaa')
  })
})

describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        placement: 'top'
      }
    })
    expect(wrapper.find('.el-timeline-item__timestamp').classes()).toContain(
      'is-top'
    )
  })
})

describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        type: 'primary'
      }
    })
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--primary'
    )
  })
})
describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'red'
      }
    })

    expect(wrapper.find('.el-timeline-item__node').attributes().style).toBe(
      'background-color: red;'
    )
  })
})

describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        size: 'large'
      }
    })

    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--large'
    )
  })
})

describe('TimelineItem.vue', () => {
  it('should timeline works', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        icon: 'ccc'
      }
    })
    expect(wrapper.find('.el-timeline-item__icon').classes()).toContain('ccc')
  })
})
