import ButtonGroup from '../ButtonGroup.vue'
import { mount } from '@vue/test-utils'

describe('ButtonGroup.vue', () => {
  it('should show content', () => {
    const content = 'foo'

    const wrapper = mount(ButtonGroup, {
      slots: {
        default: content
      }
    })

    expect(wrapper.text()).toContain(content)
  })
})
