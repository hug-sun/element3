import Button from '../Button.vue'
import { mount } from '@vue/test-utils'
describe('Button.vue', () => {
  describe('props', () => {
    it('type', () => {
      const wrapper = mount(Button, {
        props: {
          type: 'primary'
        }
      })

      expect(wrapper.classes()).toContain('el-button--primary')
    })

    it('icon', () => {
      const wrapper = mount(Button, {
        props: {
          icon: 'el-icon-search'
        }
      })

      expect(wrapper.classes()).toContain('el-button--default')
    })

    it('nativeType', () => {
      const wrapper = mount(Button, {
        props: {
          nativeType: 'submit'
        }
      })

      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('loading', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        }
      })

      expect(wrapper.classes()).toContain('is-loading')
      expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
    })

    it('disabled', () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    it('size', () => {
      const wrapper = mount(Button, {
        props: {
          size: 'medium'
        }
      })

      expect(wrapper.classes()).toContain('el-button--medium')
    })

    it('plain', () => {
      const wrapper = mount(Button, {
        props: {
          plain: true
        }
      })

      expect(wrapper.classes()).toContain('is-plain')
    })

    it('round', () => {
      const wrapper = mount(Button, {
        props: {
          round: true
        }
      })

      expect(wrapper.classes()).toContain('is-round')
    })

    it('circle', () => {
      const wrapper = mount(Button, {
        props: {
          circle: true
        }
      })

      expect(wrapper.classes()).toContain('is-circle')
    })
  })

  it('captures click events emitted via click', () => {
    const wrapper = mount(Button)
    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it("can't captures click events emitted via click when loading ", () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })
    wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
