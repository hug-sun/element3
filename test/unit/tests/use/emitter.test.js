import { useEmitter } from '../../../../src/use/emitter'
import { mount } from '@vue/test-utils'
import { onMounted } from 'vue'
describe('emitter', () => {
  describe('useDispatch', () => {
    it('Parent component can capture event when Child component called useDispatch', () => {
      const Child = {
        template: '<div></div>',
        setup() {
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', [1, 2])
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
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', [1, 2])
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
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', [1, 2])
        }
      }

      const Child = {
        template: '<div><foo></foo></div>',
        components: { Foo }
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

  describe('useBroadcast', () => {
    it('Child component can capture event when the parent component called useBroadcast', () => {
      const Child = {
        name: 'Child',
        template: '<div></div>'
      }

      const Parent = {
        components: {
          Child
        },
        template: '<div><child></child></div>',
        setup() {
          const { broadcast } = useEmitter()
          onMounted(() => {
            broadcast('Child', 'child', [1, 2])
          })
        }
      }

      const wrapper = mount(Parent)

      expect(wrapper.findComponent({ name: 'Child' }).emitted('child')).toEqual(
        [[1, 2]]
      )
    })

    it('should can not capture event when can not find target child component', () => {
      const Child = {
        name: 'Child',
        template: '<div></div>'
      }

      const Parent = {
        components: {
          Child
        },
        template: '<div><child></child></div>',
        setup() {
          const { broadcast } = useEmitter()
          onMounted(() => {
            broadcast('Foo', 'child', [1, 2])
          })
        }
      }

      const wrapper = mount(Parent)

      expect(
        wrapper.findComponent({ name: 'Child' }).emitted('child')
      ).toBeFalsy()
    })

    it('multilayer nested ', () => {
      const Foo = {
        name: 'Foo',
        template: '<div>foo</div>'
      }

      const Child = {
        name: 'Child',
        template: '<div><foo></foo></div>',
        components: { Foo }
      }

      const Parent = {
        name: 'Parent',
        template: '<div><child></child></div>',
        components: {
          Child
        },
        setup() {
          onMounted(() => {
            const { broadcast } = useEmitter()
            broadcast('Foo', 'foo', [1, 2])
          })
        }
      }

      const wrapper = mount(Parent)

      expect(wrapper.findComponent({ name: 'Foo' }).emitted('foo')).toEqual([
        [1, 2]
      ])
    })
  })
})
