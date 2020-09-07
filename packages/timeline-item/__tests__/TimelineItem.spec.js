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
