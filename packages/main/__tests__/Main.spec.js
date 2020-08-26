import { mount } from '@vue/test-utils'
import Main from '../Main.vue'
describe('Main.vue', () => {
  test('Main 渲染', () => {
    const wrapper = mount(Main)
    expect(wrapper.classes()).toContain('el-main')
  })
})
