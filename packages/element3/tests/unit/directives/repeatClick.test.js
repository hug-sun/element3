import { mount } from '@vue/test-utils'
import repeatClick from '../../../src/directives/repeatClick'

describe('directives: repeat-click', () => {
  test('should called repeat click callback when emitted mousedown event ', (done) => {
    const handleRepeatClick = jest.fn()
    const Comp = {
      template: '<div v-repeat-click=handleRepeatClick></div>',
      setup() {
        return {
          handleRepeatClick
        }
      }
    }

    const wrapper = mount(Comp, {
      global: {
        directives: {
          repeatClick
        }
      }
    })

    wrapper.trigger('mousedown')

    setTimeout(() => {
      expect(handleRepeatClick).toBeCalled()
      done()
    }, 100)
  })

  test('should called repeat click callback when emitted mousedown event and mouseup event ', () => {
    const handleRepeatClick = jest.fn()
    const Comp = {
      template: '<div v-repeat-click=handleRepeatClick></div>',
      setup() {
        return {
          handleRepeatClick
        }
      }
    }

    const wrapper = mount(Comp, {
      global: {
        directives: {
          repeatClick
        }
      }
    })
    wrapper.trigger('mousedown')
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(handleRepeatClick).toBeCalled()
  })
})
