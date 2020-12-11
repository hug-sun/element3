import Container from '../Container.vue'
import Header from '../../header/Header.vue'
import Main from '../../main/Main.vue'
import { mount } from '@vue/test-utils'

describe('Container.vue', () => {
  test('Container render', () => {
    const text = 'my name is XiaoNing'
    const wrapper = mount(Container, {
      slots: {
        default: text
      }
    })
    expect(wrapper.text()).toEqual(text)
  })

  test('vertical', () => {
    const TestComponent = {
      template: `
        <el-container>
          <el-header></el-header>
          <el-main></el-main>
        </el-container>`,
      components: {
        'el-container': Container,
        'el-header': Header,
        'el-main': Main
      }
    }

    const wrapper = mount(TestComponent)
    //  如果存在is-vertical 证明正确
    expect(wrapper.classes('is-vertical')).toBe(true)
  })

  test('direction', () => {
    const TestComponent = {
      template: `
        <el-container :direction="direction">
          <el-header></el-header>
          <el-main></el-main>
        </el-container>`,
      data() {
        return {
          direction: 'horizontal'
        }
      }
    }
    const wrapper = mount(TestComponent)
    // 默认没有is-vertical

    expect(wrapper.classes('is-vertical')).toBe(false)
    wrapper.vm.direction = 'vertical'
    // 子元素排列方向改为vertical 时 将会添加is-vertical
    wrapper.vm.$nextTick(() => {
      expect(wrapper.classes('is-vertical')).toBe(true)
    })
  })
})
