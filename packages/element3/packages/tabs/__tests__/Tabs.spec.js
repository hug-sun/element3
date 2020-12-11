import { mount } from '@vue/test-utils'
import { h, nextTick } from '@vue/runtime-core'
import Tabs from '../Tabs'
import TabPane from '../../tab-pane/TabPane'

describe('Tabs', () => {
  it('Tabs and TabPane simple to use', async () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: {
          render() {
            return [
              h(TabPane, { label: '标签1' }, () => '内容1'),
              h(TabPane, { label: '标签2' }, () => '内容2')
            ]
          }
        }
      }
    })
    await nextTick()
    expect(wrapper.vm.tabList.length).toBe(2)
    const tab = wrapper.findAll('[role=tab]')
    await tab[1].trigger('click')
    await nextTick()
    expect(tab[1].classes()).toContain('is-active')
    expect(wrapper.vm.state.activeIndex === 1).toBeTruthy()
  })

  it('Tabs and TabPane use vModel', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'b1',
        'onUpdate:modelValue': (name) => {
          expect(name).toBe('b2')
        }
      },
      slots: {
        default: {
          render() {
            return [
              h(TabPane, { label: '标签1', name: 'b1' }, () => '内容1'),
              h(TabPane, { label: '标签2', name: 'b2' }, () => '内容2')
            ]
          }
        }
      }
    })
    await nextTick()
    const tab = wrapper.findAll('[role=tab]')
    await tab[1].trigger('click')
    await nextTick()
    expect(tab[1].classes()).toContain('is-active')
  })

  it('Tabs and TabPane listen edit event', async () => {
    const wrapper = mount(Tabs, {
      props: {
        editable: true,
        onEdit(targetName, action) {
          expect(targetName).toBe('b2')
          expect(action).toBe('remove')
        }
      },
      slots: {
        default: {
          render() {
            return [
              h(TabPane, { label: '标签1', name: 'b1' }, () => '内容1'),
              h(TabPane, { label: '标签2', name: 'b2' }, () => '内容2')
            ]
          }
        }
      }
    })
    await nextTick()
    const tab = wrapper.findAll('[role=tab]')
    await tab[1].find('.el-icon-close').trigger('click')
  })
})
