import { mount } from '@vue/test-utils'
import Link from '../src/Link.vue'
describe('Link', () => {
  it('snapshot', () => {
    const wrapper = mount(Link)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('props', () => {
    it('initialize the Link component', () => {
      const wrapper = mount(Link)
      expect(wrapper.find('i').exists()).toBe(false)
      expect(wrapper.find('span').exists()).toBe(false)
    })
    it('should show content', () => {
      const content = 'Link'
      const wrapper = mount(Link, {
        slots: {
          default: content
        }
      })
      expect(wrapper.text()).toContain('Link')
    })

    it('set the type, link displays the corresponding style', () => {
      const type = 'primary'
      const wrapper = mount(Link, {
        props: {
          type
        }
      })
      expect(wrapper.classes()).toContain(`el-link--${type}`)
    })

    it('set the disabled, link displays the corresponding style', () => {
      const disabled = true
      const wrapper = mount(Link, {
        props: {
          disabled
        }
      })
      expect(wrapper.classes()).toContain('is-disabled')
    })

    it('set the underline, link displays the corresponding style', () => {
      const underline = true
      const wrapper = mount(Link, {
        props: {
          underline
        }
      })

      expect(wrapper.classes()).toContain('is-underline')
    })

    it('set the href', () => {
      const href = 'https://element3-ui.com/'
      const wrapper = mount(Link, {
        props: {
          href
        }
      })
      expect(wrapper.attributes('href')).toBe(href)
    })

    it('set the icon, link displays the corresponding style', () => {
      const icon = 'el-icon-search'
      const wrapper = mount(Link, {
        props: {
          icon
        }
      })
      const i = wrapper.find('i')
      expect(i.exists()).toBe(true)
      expect(i.classes()).toContain(icon)
    })

    it('should get target attr value', () => {
      const wrapper = mount(Link, {
        props: {
          target: '_blank'
        }
      })
      expect(wrapper.attributes('target')).toBe('_blank')
    })
  })

  describe('click', () => {
    it('should captured click events emitted via click', () => {
      const wrapper = mount(Link)
      wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    describe("can't captured click event emitted", () => {
      it('when disabled prop is equal to true', () => {
        const wrapper = mount(Link, {
          props: {
            disabled: true
          }
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
      })

      it('when href prop is to be truthy', () => {
        const wrapper = mount(Link, {
          props: {
            href: 'https://element3-ui.com/'
          }
        })
        wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeFalsy()
      })
    })
  })
})
