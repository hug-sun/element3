import { mount } from '@vue/test-utils'
import Container from '../Container.vue'
import ElHeader from '../components/header'
import ElFooter from '../components/footer'
import ElMain from '../components/main'
import ElAside from '../components/aside'
describe('Container.vue', () => {
  it('Container snapshot', () => {
    const wrapper = mount(Container)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('Container class', () => {
    it('contain has class .el-container', () => {
      const wrapper = mount(Container)
      expect(wrapper.find('.el-container').exists()).toBe(true)
    })
    it ('contian has class .is-vertical by prop direction=vertical', () => {
      const wrapper = mount(Container, {
        props: {
          direction: 'vertical',
        },
      })
      expect(wrapper.find('.is-vertical').exists()).toBe(true)
    })
    it ('contian has class .is-vertical by prop direction=horizontal', () => {
      const wrapper = mount(Container, {
        props: {
          direction: 'horizontal',
        },
      })
      expect(wrapper.find('.is-vertical').exists()).toBe(false)
    })
  })
  describe('Container slot', () => {
    it('slot has el-header', () => {
      const wrapper = mount({
        template: `
          <el-container>
            <el-header></el-header>
            <el-main>
              <el-aside></el-aside>
            </el-main>
          </el-container>
        `,
        components: {
          'el-container': Container,
          'el-header': ElHeader,
          'el-main': ElMain,
          'el-aside': ElAside,
        },
      })

      // expect(wrapper.classes()).toBe(true);
      // expect(wrapper.find('.is-vertical').exists()).toBe(true)
      expect(wrapper.find('.is-vertical').exists()).toBe(true)
    })
    it('slot has el-footer', () => {
      const wrapper = mount({
        template: `
          <el-container>
            <el-main>
              <el-aside></el-aside>
            </el-main>
            <el-footer></el-footer>
          </el-container>
        `,
        components: {
          'el-container': Container,
          'el-main': ElMain,
          'el-aside': ElAside,
          'el-footer': ElFooter,
        },
      })

      expect(wrapper.find('.is-vertical').exists()).toBe(true)
    })
  })
})

