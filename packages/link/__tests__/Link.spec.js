import { mount } from '@vue/test-utils'
import Link from '../Link.vue'
describe('Link', () => {
  describe('props', () => {
    it('type', () => {
      const wrapper = mount(Link, {
        props: {
          type: 'primary'
        }
      })

      expect(wrapper.classes()).toContain('el-link--primary')
    })

    it('icon', () => {
      const wrapper = mount(Link, {
        props: {
          icon: 'el-icon-search'
        }
      })

      expect(wrapper.find('.el-icon-search').exists()).toBe(true)
    })

    it('href', () => {
      const wrapper = mount(Link, {
        props: {
          href: 'https://element3.gitee.io/'
        }
      })

      expect(wrapper.attributes('href')).toBe('https://element3.gitee.io/')
    })

    it('should get target attr value', () => {
      // because set v-bind='$attrs' to a element
      const wrapper = mount(Link, {
        props: {
          target: '_blank'
        }
      })

      expect(wrapper.attributes('target')).toBe('_blank')
    })

    it('should link is disabled when set disabled prop to be true', () => {
      const wrapper = mount(Link, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })
  })

  describe('click', () => {
    it('should captured click events emitted via click', () => {
      const wrapper = mount(Link)
      wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    describe("can't captured click event emitted", () => {
      it('when disabled prop is equal to true ', () => {
        const wrapper = mount(Link, {
          props: {
            disabled: true
          }
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
      })

      it('when href prop is to be truthy ', () => {
        const wrapper = mount(Link, {
          props: {
            href: 'http://www.baidu.com'
          }
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
      })
    })
  })
})
