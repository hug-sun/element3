import { createComponent } from 'main/use/component.js'

describe('component', () => {
  describe('createComponent', () => {
    it('should get component instance', () => {
      const $cf = jest.fn()
      const Comp = {
        setup() {
          return {
            $cf
          }
        }
      }

      const instance = createComponent(Comp)
      instance.$cf()

      expect($cf).toBeCalled()
    })
  })
})
