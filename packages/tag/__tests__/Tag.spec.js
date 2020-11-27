import Tag from '../Tag.vue'
import { mount } from '@vue/test-utils'

describe('Tag.vue', () => {
  describe('props', () => {
    it('test slot', () => {
      const wrapper = mount(Tag, {
        slots: {
          default: () => '标签'
        }
      })
      expect(wrapper.text()).toBe('标签')
    })

    it('test type', () => {
      const type = 'sucess'
      const wrapper = mount(Tag, {
        props: {
          type
        }
      })
      expect(wrapper.classes()).toContain(`el-tag--${type}`)
    })

    it('test color', () => {
      const wrapper = mount(Tag, {
        props: {
          color: 'red'
        }
      })
      expect(wrapper.attributes('style')).toBe('background-color: red;')
    })

    it('test effect', () => {
      const effect = 'plain'
      const wrapper = mount(Tag, {
        props: {
          effect
        }
      })
      expect(wrapper.classes()).toContain(`el-tag--${effect}`)
    })

    it('test hit', () => {
      const wrapper = mount(Tag, {
        props: {
          hit: true
        }
      })
      expect(wrapper.classes()).toContain('is-hit')
    })

    it('test closable', () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true
        }
      })
      const iWrapper = wrapper.find('i')
      expect(iWrapper.classes()).toContain('el-tag__close')
      expect(iWrapper.classes()).toContain('el-icon-close')
    })

    it('test size', () => {
      const size = 'medium'
      const wrapper = mount(Tag, {
        props: {
          size
        }
      })
      expect(wrapper.classes()).toContain(`el-tag--${size}`)
    })

    // it('test disable-transitions', () => {
    //   // TODO
    //   const wrapper = mount(Tag, {
    //     props: {
    //       closable: true,
    //       disableTransitions: false
    //     }
    //   })
    // })
  })
  describe('event', () => {
    it('test click closable', () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true
        }
      })
      wrapper.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.find('.el-tag .el-tag__close').exists()).toBeTruthy()
    })
    it('test click tag', () => {
      const wrapper = mount({
        template: `
              <el-tag ref="tag" @click="handleClick">点击标签</el-tag>
              `,
        data() {
          return {
            clicksCount: 0
          }
        },
        methods: {
          handleClick() {
            this.clicksCount = this.clicksCount + 1
          }
        }
      })

      wrapper.trigger('click')

      expect(wrapper.vm.clicksCount).toBe(1)
    })
  })
})
