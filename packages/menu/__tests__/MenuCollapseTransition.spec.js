import MenuCollapseTransition from '../MenuCollapseTransition.vue'
import { mount } from '@vue/test-utils'

describe('MenuCollapseTransition.vue', () => {
  it('should ', () => {
    const wrapper = mount(MenuCollapseTransition, {
      slots: {
        default: '<div>foo</div>'
      }
    })

    expect(wrapper.html()).toContain('<div>foo</div>')
  })
})
