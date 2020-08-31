import { useEmitter } from '../../../../src/use/emitter'
import { mount } from '@vue/test-utils'
import { onMounted } from 'vue'
describe('emitter', () => {
  describe('on', () => {
    it('parent to child', () => {
      const handleChild = jest.fn()

      const Child = {
        name: 'Child',
        template: '<div></div>',
        setup(props, { emit }) {
          const { on } = useEmitter()

          on('child', handleChild)
        }
      }

      const Parent = {
        components: {
          Child
        },

        template: '<div><child></child></div>',
        setup() {
          const { broadcast } = useEmitter()
          onMounted(() => {
            broadcast('Child', 'child', 1, 2)
          })
        }
      }

      mount(Parent)

      expect(handleChild).toBeCalledWith(1, 2)
    })

    it('child to parent', () => {
      const handleFoo1 = jest.fn()
      const handleFoo2 = jest.fn()

      const Child = {
        template: '<div></div>',
        setup() {
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', 1, 2)
        }
      }

      const Parent = {
        name: 'Parent',
        template: '<div><child></child></div>',
        components: {
          Child
        },
        setup() {
          const { on } = useEmitter()
          on('foo', handleFoo1)
          on('foo', handleFoo2)
        }
      }

      mount(Parent)

      expect(handleFoo1).toBeCalledWith(1, 2)
      expect(handleFoo2).toBeCalledWith(1, 2)
    })
  })

  describe('once', () => {
    it('parent to child', () => {
      const handleChildOn = jest.fn()
      const handleChildOnce = jest.fn()
      let broadcastFn
      const ChildOn = {
        name: 'ChildOn',
        template: '<div></div>',
        setup(props, { emit }) {
          const { on } = useEmitter()
          on('child', handleChildOn)
        }
      }
      const ChildOnce = {
        name: 'ChildOnce',
        template: '<div></div>',
        setup(props, { emit }) {
          const { once } = useEmitter()
          once('child', handleChildOnce)
        }
      }

      const Parent = {
        components: {
          ChildOn,
          ChildOnce
        },

        template: '<div><childOn></childOn><childOnce></childOnce></div>',
        setup() {
          const { broadcast } = useEmitter()
          onMounted(() => {
            broadcast('ChildOn', 'child', 1, 2)
            broadcast('ChildOn', 'child', 2, 3)
            broadcast('ChildOnce', 'child', 1, 2)
            broadcast('ChildOnce', 'child', 2, 3)
          })
        }
      }

      mount(Parent)

      expect(handleChildOn).toBeCalledWith(2, 3)
      expect(handleChildOn).toBeCalledTimes(2)
      expect(handleChildOnce).toBeCalledWith(1, 2)
      expect(handleChildOnce).toBeCalledTimes(1)
    })

    it('child to parent', () => {
      const handleFoo1 = jest.fn()
      const handleFoo2 = jest.fn()

      const Child = {
        template: '<div></div>',
        setup() {
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', 1, 2)
          dispatch('Parent', 'foo', 1, 2)
        }
      }

      const Parent = {
        name: 'Parent',
        template: '<div><child></child></div>',
        components: {
          Child
        },
        setup() {
          const { once } = useEmitter()
          once('foo', handleFoo1)
          once('foo', handleFoo2)
        }
      }

      mount(Parent)

      expect(handleFoo1).toBeCalledWith(1, 2)
      expect(handleFoo2).toBeCalledWith(1, 2)
      expect(handleFoo1).toBeCalledTimes(1)
      expect(handleFoo2).toBeCalledTimes(1)
    })
  })
  describe('off', () => {
    it('off all', () => {
      const handleFoo = jest.fn()
      const handleBar = jest.fn()

      const Foo = {
        template: '<div></div>',
        setup(props, { emit }) {
          const { on, off } = useEmitter()
          on('foo', handleFoo)
          on('bar', handleBar)

          off()
          emit('foo')
          emit('bar')
        }
      }

      mount(Foo)

      expect(handleFoo).toBeCalledTimes(0)
      expect(handleBar).toBeCalledTimes(0)
    })

    it('off special event', () => {
      const handleFoo1 = jest.fn()
      const handleFoo2 = jest.fn()
      const handleBar = jest.fn()

      const Foo = {
        template: '<div></div>',
        setup(props, { emit }) {
          const { on, off } = useEmitter()
          on('foo', handleFoo1)
          on('foo', handleFoo1)
          on('bar', handleBar)

          off('foo')
          emit('foo')
          emit('bar')
        }
      }

      mount(Foo)

      expect(handleFoo1).toBeCalledTimes(0)
      expect(handleFoo2).toBeCalledTimes(0)
      expect(handleBar).toBeCalledTimes(1)
    })

    it('off special handler', () => {
      const handleFoo1 = jest.fn()
      const handleFoo2 = jest.fn()
      const handleBar = jest.fn()

      const Foo = {
        template: '<div></div>',
        setup(props, { emit }) {
          const { on, off } = useEmitter()
          on('foo', handleFoo1)
          on('foo', handleFoo2)
          on('bar', handleBar)

          off('foo', handleFoo1)
          emit('foo')
          emit('bar')
        }
      }

      mount(Foo)

      expect(handleFoo1).toBeCalledTimes(0)
      expect(handleFoo2).toBeCalledTimes(1)
      expect(handleBar).toBeCalledTimes(1)
    })
  })

  describe('dispatch', () => {
    it('Parent component can capture event when Child component called dispatch', () => {
      const Child = {
        template: '<div></div>',
        setup() {
          const { dispatch } = useEmitter()
          dispatch('Parent', 'foo', 1, 2)
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
          dispatch('Parent', 'foo', 1, 2)
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
            broadcast('Child', 'child', 1, 2)
          })
        }
      }

      const wrapper = mount(Parent)

      expect(
        wrapper.findComponent({ name: 'Child' }).emitted('child')
      ).toEqual([[1, 2]])
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
            broadcast('Foo', 'child', 1, 2)
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
            broadcast('Foo', 'foo', 1, 2)
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
