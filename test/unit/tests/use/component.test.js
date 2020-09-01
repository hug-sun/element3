import { createComponent } from 'main/use/component.js'

describe('component', () => {
  describe('createComponent', () => {
    it('should get component instance', () => {
      const $cf = jest.fn()
      const Comp = {
        template: '<div>foo</div>',
        setup() {
          return {
            $cf
          }
        }
      }

      const instance = createComponent(Comp)
      instance.ctx.$cf()

      expect($cf).toBeCalled()
      expect(instance.ctx.$el.innerHTML).toBe('foo')
    })
  })
})
