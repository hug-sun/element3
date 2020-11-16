import Card from '../Card.vue'
import { mount } from '@vue/test-utils'
describe('Card.vue', () => {
  describe('header', () => {
    it('text', () => {
      const wrapper = mount(Card, {
        props: {
          header: 'Header2'
        }
      })

      expect(wrapper.find('.el-card__header').text()).toBe('Header2')
    })

    it('slot', () => {
      const wrapper = mount(Card, {
        slots: {
          header: 'SoltHeader'
        }
      })

      expect(wrapper.find('.el-card__header').text()).toBe('SoltHeader')
    })
  })

  it('bodyStyle', () => {
    const wrapper = mount(Card, {
      props: {
        bodyStyle: { padding: '10px' }
      }
    })
    expect(wrapper.find('.el-card__body').attributes().style).toBe(
      'padding: 10px;'
    )
  })

  describe('shadow', () => {
    it('alwarys', () => {
      const wrapper = mount(Card, {
        props: {
          shadow: 'always'
        }
      })
      expect(wrapper.classes()).toContain('is-always-shadow')
    })

    it('hover', () => {
      const wrapper = mount(Card, {
        props: {
          shadow: 'hover'
        }
      })
      expect(wrapper.classes()).toContain('is-hover-shadow')
    })

    it('never', () => {
      const wrapper = mount(Card, {
        props: {
          shadow: 'never'
        }
      })
      expect(wrapper.classes()).toContain('is-never-shadow')
    })
  })
})
