import { useDispatch } from '../../../../src/use/emitter'
import { mount } from '@vue/test-utils'
describe('emitter', () => {
  describe('useDispatch', () => {
    it('Parent component can capture event when Child component called useDispatch', () => {
      const Child = {
        template: '<div></div>',
        setup() {
          useDispatch('Parent', 'foo', [1, 2])
        }
      }

      const Parent = {
        name: 'Parent',
        template: '<div><child></child></div>',
        components: {
          Child
        }
      }

      const wrapper = mount(Parent)

      expect(wrapper.emitted('foo')).toEqual([[1, 2]])

    })

    it('should can not capture event when can not find target parent component', () => {
      const Child = {
        template: '<div></div>',
        setup() {
          useDispatch('Parent', 'foo', [1, 2])
        }
      }

      const Parent = {
        template: '<div><child></child></div>',
        components: {
          Child
        }
      }

      const wrapper = mount(Parent)

      expect(wrapper.emitted('foo')).toBeFalsy()
    })

    it('multilayer nested ', () => {

      const Foo = {
        template: '<div>foo</div>',
        setup() {
          useDispatch('Parent', 'foo', [1, 2])
        }
      }

      const Child = {
        template: '<div><foo></foo></div>',
        components: {Foo}
      }

      const Parent = {
        name: 'Parent',
        template: '<div><child></child></div>',
        components: {
          Child
        }
      }

      const wrapper = mount(Parent)

      expect(wrapper.emitted('foo')).toEqual([[1, 2]])

    })
  })
})
