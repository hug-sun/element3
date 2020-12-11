import { mount } from '@vue/test-utils'
import mousewheel from '../../../src/directives/mousewheel'

describe('directives: mousewheel', () => {
  test('should called mousewheel callback when emitted mousewheel event', async () => {
    const handleMousewheel = jest.fn()
    const Comp = {
      template: '<div v-mousewheel=handleMousewheel></div>',
      setup() {
        return {
          handleMousewheel
        }
      }
    }

    const wrapper = mount(Comp, {
      global: {
        directives: {
          mousewheel
        }
      }
    })
    wrapper.trigger('mousewheel')

    expect(handleMousewheel).toBeCalled()
  })
})
