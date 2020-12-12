import Container from '../Container.vue'
import Header from '../../header/Header.vue'
import Footer from '../../footer/Footer.vue'
import Main from '../../main/Main.vue'
import { mount } from '@vue/test-utils'

/*describe('Container.vue', () => {
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
})*/

describe('Container.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Container)
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('direction', () => {
    it('set Container vertical by prop direction', () => {
      const wrapper = mount(Container, {
        props: {
          direction: 'vertical'
        }
      })
      //这行有问题
      expect(wrapper.find('.is-vertical').exists()).toBe(true)
    })

    it('set Container horizontal by prop direction', () => {
      const wrapper = mount(Container, {
        props: {
          direction: 'horizontal'
        }
      })

      expect(wrapper.find('.is-vertical').exists()).toBe(false)
    })


    it('contain has class el-container', () => {
      const wrapper = mount(Container)
      expect(wrapper.classes('el-container')).toBe(true)
    })

  })

  describe('slot', () => {
    it('slot has el-header ', () => {
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

    it('slot has  el-footer', () => {
      const TestComponent = {
        template: `
        <el-container>
          <el-footer></el-footer>
          <el-main></el-main>
        </el-container>`,
        components: {
          'el-container': Container,
          'el-footer': Footer,
          'el-main': Main
        }
      }

      const wrapper = mount(TestComponent)
      //  如果存在is-vertical 证明正确
      expect(wrapper.classes('is-vertical')).toBe(true)
    })

  })
})
