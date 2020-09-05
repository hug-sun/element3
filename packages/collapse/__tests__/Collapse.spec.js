import { mount } from '@vue/test-utils'
import Collapse from '../Collapse.vue'
import CollapseItem from '../../collapse-item/CollapseItem.vue'

describe('Collapse', () => {
  it('multiple', (done) => {
    const multiple = {
      template: `
        <div>
          <collapse :modelValue="activeNames" @update:modelValue="updateActiveNames">
            <collapse-item v-for="item in 3" :key="item" :name="item" :title="'title'+item">{{item}}</collapse-item>
          </collapse>
        </div>
      `,
      data() {
        return {
          activeNames: [1]
        }
      },
      methods: {
        updateActiveNames(v) {
          this.activeNames = v
        }
      },
      components: { Collapse, CollapseItem }
    }

    const wrapper = mount(multiple)

    const items = wrapper.findAllComponents({ name: 'ElCollapseItem' })
    const headers = wrapper.findAll('.el-collapse-item__header')

    expect(items.length).toBe(3)
    expect(items[0].classes()).toContain('is-active')

    headers[1].trigger('click').then(() => {
      expect(items[1].classes()).toContain('is-active')
      expect(wrapper.vm.$data.activeNames.length).toBe(2)

      // TODO test中连续trigger'click'无法触发handleItemClick事件?
      // headers[2].trigger('click').then(() => {
      //   expect(items[2].classes()).toContain('is-active')
      //   expect(wrapper.vm.$data.activeNames.length).toBe(3)

      //   headers[0].trigger('click').then(() => {
      //     expect(items[0].classes().includes('is-active')).toBe(false)
      //     expect(wrapper.vm.$data.activeNames.length).toBe(2)
      //     done()
      //   })
      // })
      done()
    })
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
