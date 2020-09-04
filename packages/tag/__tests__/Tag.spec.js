import Tag from '../Tag.vue'
import { mount } from '@vue/test-utils'

describe('Tag.vue', () => {
  describe('props', () => {
    it('text', () => {
      const wrapper = mount(Tag, {
        slots: {
          default: () => '标签'
        }
      })
      expect(wrapper.text().length).toBeGreaterThanOrEqual(2)
    })

    it('text', () => {
      const wrapper = mount(Tag, {
        props: {
          type: 'primary'
        }
      })
      expect(wrapper.classes()).toContain('el-tag--primary')
    })

    it('hit', () => {
      const wrapper = mount(Tag, {
        props: {
          hit: true
        }
      })
      expect(wrapper.classes()).toContain('is-hit')
    })

    it('closeTransition', () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true,
          closeTransition: true
        }
      })
      expect(wrapper.find('.md-fade-center').exists()).toBeFalsy()
    })

    it('color', () => {
      const wrapper = mount(Tag, {
        props: {
          color: 'rgb(0, 0, 0)'
        }
      })
      expect(wrapper.attributes('style')).toBe(
        'background-color: rgb(0, 0, 0);'
      )
    })

    it('theme', () => {
      const wrapper = mount(Tag, {
        props: {
          effect: 'dark'
        }
      })
      expect(wrapper.classes()).toContain('el-tag--dark')
      expect(wrapper.find('.el-tag--light').exists()).toBeFalsy()
      expect(wrapper.find('.el-tag--plain').exists()).toBeFalsy()
    })
  })
  describe('event', () => {
    it('closable', () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true
        }
      })
      wrapper.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.find('.el-tag .el-tag__close').exists()).toBeTruthy()
    })
    it('click', () => {
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
