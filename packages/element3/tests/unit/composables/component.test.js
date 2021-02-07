import {
  createComponent,
  unmountComponent
} from 'main/composables/component.js'

describe('component', () => {
  describe('createComponent', () => {
    it('should get component instance', () => {
      const cf = jest.fn()
      const Comp = {
        template: '<div>foo</div>',
        setup() {
          return {
            cf
          }
        }
      }

      const instance = createComponent(Comp)
      instance.ctx.cf()

      expect(cf).toBeCalled()
      expect(instance.ctx.$el.innerHTML).toBe('foo')
    })

    it('the specified component should be unmounted', () => {
      const Comp = {
        template: '<div>foo</div>'
      }

      const instance = createComponent(Comp)
      expect(instance.isMounted).toBe(true)
      unmountComponent(instance)
      expect(instance.isUnmounted).toBe(true)
    })
  })
})
