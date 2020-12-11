import Timeline from '../Timeline.vue'
import TimelineItem from '../../timeline-item/TimelineItem'
import { mount } from '@vue/test-utils'
import { ref, h } from 'vue'
describe('TimeLine Test', () => {
  it('create', () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11'
      },
      {
        content: '通过审核',
        timestamp: '2020-11-12'
      },
      {
        content: '活动按期开始',
        timestamp: '2020-11-15'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    const vm = wrapper.vm
    let contentElms = wrapper.findAll('.el-timeline-item__content')
    contentElms.forEach(({ element: elm }, index) => {
      expect(elm.textContent).toEqual(vm.activities.value[index].content)
    })
    let timestampElms = wrapper.findAll('.el-timeline-item__timestamp')
    timestampElms.forEach(({ element: elm }, index) => {
      expect(elm.textContent).toEqual(vm.activities.value[index].timestamp)
    })
  })
  it('reverse', async () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11'
      },
      {
        content: '通过审核',
        timestamp: '2020-11-12'
      },
      {
        content: '活动按期开始',
        timestamp: '2020-11-15'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      props: {
        reverse: true
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    const vm = wrapper.vm
    let contentElms = wrapper.findAll('.el-timeline-item__content')
    contentElms.forEach(({ element: elm }, index) => {
      expect(elm.textContent).toEqual(
        vm.activities.value[vm.activities.value.length - index - 1].content
      )
    })
    await wrapper.setProps({
      reverse: false
    })
    contentElms = wrapper.findAll('.el-timeline-item__content')
    contentElms.forEach(({ element: elm }, index) => {
      expect(elm.textContent).toEqual(vm.activities.value[index].content)
    })
  })
  it('placement', async () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        placement: 'top'
      },
      {
        content: '通过审核',
        timestamp: '2020-11-12'
      },
      {
        content: '活动按期开始',
        timestamp: '2020-11-15'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              placement: activities.value[index].placement
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let timestampElm = wrapper.find('.el-timeline-item__timestamp')
    expect(timestampElm.classes('is-top')).toBe(true)
  })
  it('hide-timestamp', async () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        hideTimestamp: true
      },
      {
        content: '通过审核',
        timestamp: '2020-11-12'
      },
      {
        content: '活动按期开始',
        timestamp: '2020-11-15'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              hideTimestamp: activities.value[index].hideTimestamp
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let timestampElms = wrapper.findAll('.el-timeline-item__timestamp')
    expect(timestampElms.length).toEqual(2)
  })
  it('color', async () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        color: '#f00'
      },
      {
        content: '通过审核',
        timestamp: '2020-11-12'
      },
      {
        content: '活动按期开始',
        timestamp: '2020-11-15'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              color: activities.value[index].color
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let nodeElm = wrapper.find('.el-timeline-item__node').element
    expect(nodeElm.style.backgroundColor).toEqual('rgb(255, 0, 0)')
  })
  it('type', () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        type: 'primary'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              type: activities.value[index].type
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let nodeElm = wrapper.find('.el-timeline-item__node')
    expect(nodeElm.classes()).toContain('el-timeline-item__node--primary')
  })

  it('size', () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        type: 'large'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              type: activities.value[index].type
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let nodeElm = wrapper.find('.el-timeline-item__node')
    expect(nodeElm.classes()).toContain('el-timeline-item__node--large')
  })

  it('icon', () => {
    const activities = ref([
      {
        content: '创建成功',
        timestamp: '2020-11-11',
        icon: 'el-icon-more'
      }
    ])
    const wrapper = mount(Timeline, {
      data() {
        return {
          activities: activities
        }
      },
      slots: {
        default: activities.value.map((activity, index) => {
          return h(
            TimelineItem,
            {
              key: index,
              timestamp: activities.value[index].timestamp,
              icon: activities.value[index].icon
            },
            () => {
              return activities.value[index].content
            }
          )
        })
      }
    })
    let nodeElm = wrapper.find('.el-timeline-item__icon')
    expect(nodeElm.classes()).toContain('el-icon-more')
  })
})
