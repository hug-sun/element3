import { mount, flushPromises } from '@vue/test-utils'
import Rate from '../src/Rate.vue'

describe('Rate', () => {
  it('should  show five unselected star icon', () => {
    const wrapper = mount(Rate)

    const unselectedItems = wrapper.findAll('.el-rate__item .el-icon-star-off')

    expect(unselectedItems.length).toBe(5)
  })

  it('should show four item when set prop max equal to four', () => {
    const wrapper = mount(Rate, {
      props: {
        max: 4
      }
    })

    const unselectedItems = wrapper.findAll('.el-rate__item .el-icon-star-off')

    expect(unselectedItems.length).toBe(4)
  })

  it('点击当前 icon 的时候，当前 icon 包括之前的 icon 都切换到选中状态', async () => {
    const wrapper = mount(Rate)

    // click third icon
    const thirdItem = wrapper.findAll('.el-rate__item')[2]
    thirdItem.trigger('click')

    await flushPromises()
    const items = wrapper.findAll('.el-rate__item')
    expect(items[0].get('i').classes('el-icon-star-on')).toBe(true)
    expect(items[1].get('i').classes('el-icon-star-on')).toBe(true)
    expect(items[2].get('i').classes('el-icon-star-on')).toBe(true)
    expect(items[3].get('i').classes('el-icon-star-off')).toBe(true)
    expect(items[4].get('i').classes('el-icon-star-off')).toBe(true)
  })
})
