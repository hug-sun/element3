import Timeline from '../Timeline.vue'
import TimelineItem from '../../timeline-item/TimelineItem'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

function createTimelineItem({ key, props, content }) {
  return h(
    TimelineItem,
    {
      key,
      ...props
    },
    () => content
  )
}

function createTimelineItems(items) {
  return items.map((item, index) => {
    const { content, ...props } = item
    return createTimelineItem({ key: index, props, content })
  })
}

const activities = {
  _values: [],
  replace(val) {
    this._values = val
  },
  _normalizeIndex(index) {
    const start = index >= 0 ? 0 : this._values.length
    return start + index
  },
  elementAt(index) {
    return this._values[this._normalizeIndex(index)]
  },
  contentAt(index) {
    return this.elementAt(index).content
  },
  timestampAt(index) {
    return this.elementAt(index).timestamp
  },
  update(index, patch) {
    const normalizedIndex = this._normalizeIndex(index)
    this._values[normalizedIndex] = {
      ...this._values[normalizedIndex],
      ...patch
    }
  },
  map(cb) {
    return this._values.map(cb)
  }
}

describe('TimeLine Test', () => {
  beforeEach(() => {
    activities.replace([
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
  })

  it('should render empty list given no slots', () => {
    const wrapper = mount(Timeline)
    expect(wrapper.element.children.length).toBe(0)
  })

  it('create', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })

    wrapper
      .findAll('.el-timeline-item__content')
      .forEach((contentWrapper, index) => {
        expect(contentWrapper.text()).toEqual(activities.contentAt(index))
      })

    wrapper
      .findAll('.el-timeline-item__timestamp')
      .forEach((timestampWrapper, index) => {
        expect(timestampWrapper.text()).toEqual(activities.timestampAt(index))
      })
  })

  it('reverse', async () => {
    const wrapper = mount(Timeline, {
      props: {
        reverse: true
      },
      slots: {
        default: createTimelineItems(activities)
      }
    })

    wrapper
      .findAll('.el-timeline-item__content')
      .forEach((contentWrapper, index) => {
        expect(contentWrapper.text()).toEqual(activities.contentAt(-index - 1))
      })

    await wrapper.setProps({
      reverse: false
    })

    wrapper
      .findAll('.el-timeline-item__content')
      .forEach((contentWrapper, index) => {
        expect(contentWrapper.text()).toEqual(activities.contentAt(index))
      })
  })

  it('should reverse fragment slots', async () => {
    const wrapper = mount(
      {
        template: `
        <timeline :reverse="reverse">
          <timeline-item
            v-for="(item, index) in items"
            :key="index"
            :timestamp="item.timestamp"
          >
            {{ item.content }}
          </timeline-item>
        </timeline>
      `,
        props: ['items', 'reverse'],
        components: { Timeline, TimelineItem }
      },
      {
        props: {
          reverse: true,
          items: activities._values
        }
      }
    )

    wrapper
      .findAll('.el-timeline-item__content')
      .forEach((contentWrapper, index) => {
        expect(contentWrapper.text()).toEqual(activities.contentAt(-index - 1))
      })

    await wrapper.setProps({
      reverse: false
    })

    wrapper
      .findAll('.el-timeline-item__content')
      .forEach((contentWrapper, index) => {
        expect(contentWrapper.text()).toEqual(activities.contentAt(index))
      })
  })

  it('placement', async () => {
    activities.update(0, { placement: 'top' })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const timestampWrapper = wrapper.find('.el-timeline-item__timestamp')
    expect(timestampWrapper.classes('is-top')).toBe(true)
  })

  it('hide-timestamp', async () => {
    activities.update(0, { hideTimestamp: true })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const timestampWrapper = wrapper.findAll('.el-timeline-item__timestamp')
    expect(timestampWrapper.length).toEqual(2)
  })

  it('color', async () => {
    activities.update(0, { color: '#f00' })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const nodeElm = wrapper.find('.el-timeline-item__node').element
    expect(nodeElm.style.backgroundColor).toEqual('rgb(255, 0, 0)')
  })

  it('type', () => {
    activities.update(0, { type: 'primary' })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const nodeWrapper = wrapper.find('.el-timeline-item__node')
    expect(nodeWrapper.classes()).toContain('el-timeline-item__node--primary')
  })

  it('size', () => {
    activities.update(0, { type: 'large' })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const nodeWrapper = wrapper.find('.el-timeline-item__node')
    expect(nodeWrapper.classes()).toContain('el-timeline-item__node--large')
  })

  it('icon', () => {
    activities.update(0, { icon: 'el-icon-more' })

    const wrapper = mount(Timeline, {
      slots: {
        default: createTimelineItems(activities)
      }
    })
    const nodeWrapper = wrapper.find('.el-timeline-item__icon')
    expect(nodeWrapper.classes()).toContain('el-icon-more')
  })
})
