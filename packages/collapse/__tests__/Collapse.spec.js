import { mount } from '@vue/test-utils'
import Collapse from '../Collapse.vue'
import CollapseItem from '../../collapse-item/CollapseItem.vue'

describe('Collapse', () => {
  it('multiple', () => {
    // TODO 多选
  })
  it('accordion', () => {
    // TODO 手风琴模式
  })
  it('item disable', () => {
    const disable = {
      template: `
        <div>
          <collapse>
            <collapse-item key="1" name="1" title="title1">1</collapse-item>
            <collapse-item key="2" name="2" title="title2">2</collapse-item>
            <collapse-item key="3" name="3" title="title3" disabled>3</collapse-item>
          </collapse>
        </div>
      `,
      components: { Collapse, CollapseItem }
    }
    const wrapper = mount(disable)
    const items = wrapper.findAllComponents({ name: 'ElCollapseItem' })
    expect(items[2].classes()).toContain('is-disabled')
  })
  it('slot title', () => {
    const disable = {
      template: `
        <div>
          <collapse>
            <collapse-item key="1" name="1">
              <template v-slot:title>
                title---1
              </template>
              1
            </collapse-item>
            <collapse-item key="2" name="2" title="title2">2</collapse-item>
            <collapse-item key="3" name="3" title="title3" disabled>3</collapse-item>
          </collapse>
        </div>
      `,
      components: { Collapse, CollapseItem }
    }
    const wrapper = mount(disable)
    const items = wrapper.findAllComponents({ name: 'ElCollapseItem' })
    expect(items[0].find('.el-collapse-item__header').text()).toBe('title---1')
  })
})
