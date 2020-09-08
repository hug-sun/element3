import { mount } from '@vue/test-utils'
import Backtop from '../Backtop.vue'
describe('Backtop.vue', () => {
  const containerDeaultSlot = `<div class="target" style="width:100px;height:100px;overflow-y:scroll">
            <div style="height:4000px;width:100%">
            <el-backtop target=".target" :visibilityHeight="2000" :right="20" :bottom="20">
            </el-backtop>
            </div>
        </div>`
  const containerSlot = `<div class="target" style="width:100px;height:100px;overflow-y:scroll">
            <div style="height:4000px;width:100%">
            <el-backtop target=".target" :visibilityHeight="2000" :right="20" :bottom="20">
                <div id="slot">
                向上
                </div>
            </el-backtop>
            </div>
        </div>`
  const _mount = (temp) => {
    return mount(
      {
        components: {
          'el-backtop': Backtop
        },
        template: temp
      },
      {
        attachTo: document.body
      }
    )
  }
  const defaultWrapper = _mount(containerDeaultSlot)
  const slotWrapper = _mount(containerSlot)
  describe('props', () => {
    it('defaultSlot', async () => {
      expect(defaultWrapper.find('.el-backtop').exists()).toBe(false)
      defaultWrapper.element.scrollTop = 2000
      await defaultWrapper.trigger('scroll')
      expect(defaultWrapper.find('.el-backtop').exists()).toBe(true)
      expect(defaultWrapper.find('.el-backtop').attributes('style')).toBe(
        'right: 20px; bottom: 20px;'
      )
      expect(defaultWrapper.find('.el-icon-caret-top').exists()).toBe(true)
    })
    it('slot', async () => {
      slotWrapper.element.scrollTop = 2000
      await slotWrapper.trigger('scroll')
      expect(slotWrapper.find('.el-icon-caret-top').exists()).toBe(false)
      expect(slotWrapper.find('#slot').exists()).toBe(true)
      expect(slotWrapper.find('#slot').text()).toBe('向上')
      slotWrapper.unmount()
    })
  })
  describe('event', () => {
    it('click', async () => {
      await defaultWrapper.find('.el-backtop').trigger('click')
      setTimeout(() => {
        expect(defaultWrapper.find('.el-icon-caret-top').exists()).toBe(false)
      })
    })
  })
})
