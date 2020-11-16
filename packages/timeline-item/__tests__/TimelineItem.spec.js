import TimelineItem from '../TimelineItem.vue'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

describe('TimelineItem Test', () => {
  it('slots', async () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2020-11-16'
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__content').text()).toBe('创建流程')
  })

  it('timestamp', async () => {
    const itemTimestamp = ref('2020-11-16')
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: itemTimestamp
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__timestamp').text()).toBe(
      '2020-11-16'
    )
    itemTimestamp.value = '2020-11-17'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__timestamp').text()).toBe(
      '2020-11-17'
    )
  })

  it('hideTimestamp', async () => {
    const hideTimestampRef = ref(false)
    const wrapper = mount(TimelineItem, {
      props: {
        hideTimestamp: hideTimestampRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.findAll('.el-timeline-item__timestamp').length).toBe(1)
    hideTimestampRef.value = true
    await nextTick()
    expect(wrapper.findAll('.el-timeline-item__timestamp').length).toBe(0)
  })

  it('placement', async () => {
    const placementRef = ref() // default 'bottom'
    const wrapper = mount(TimelineItem, {
      props: {
        placement: placementRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__timestamp').classes()).toContain(
      'is-bottom'
    )
    placementRef.value = 'top'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__timestamp').classes()).toContain(
      'is-top'
    )
  })

  it('type', async () => {
    const typeRef = ref('primary')
    const wrapper = mount(TimelineItem, {
      props: {
        type: typeRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--primary'
    )
    typeRef.value = 'success'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--success'
    )
  })

  it('color', async () => {
    const colorRef = ref('red')
    const wrapper = mount(TimelineItem, {
      props: {
        color: colorRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__node').attributes().style).toBe(
      'background-color: red;'
    )
    colorRef.value = 'blue'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__node').attributes().style).toBe(
      'background-color: blue;'
    )
  })

  it('size', async () => {
    const sizeRef = ref() // default normal
    const wrapper = mount(TimelineItem, {
      props: {
        size: sizeRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--normal'
    )
    sizeRef.value = 'large'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--large'
    )
    sizeRef.value = 'small'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__node').classes()).toContain(
      'el-timeline-item__node--small'
    )
  })

  it('icon', async () => {
    const iconRef = ref('el-icon-more') // default normal
    const wrapper = mount(TimelineItem, {
      props: {
        icon: iconRef
      },
      slots: {
        default: '创建流程'
      }
    })
    expect(wrapper.find('.el-timeline-item__icon').classes()).toContain(
      'el-icon-more'
    )
    iconRef.value = 'el-icon-share'
    await nextTick()
    expect(wrapper.find('.el-timeline-item__icon').classes()).toContain(
      'el-icon-share'
    )
  })
})
