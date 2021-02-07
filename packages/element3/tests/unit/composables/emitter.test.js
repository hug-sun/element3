import { useEmitter } from '../../../src/composables/emitter'
import { mount } from '@vue/test-utils'
import { onMounted } from 'vue'

describe('useEmitter', () => {
  it('父组件使用 broadcast 给子组件发消息，子组件应该可以接受到消息', () => {
    const handleFoo = jest.fn()
    const Foo = {
      template: '<div></div>',
      setup() {
        const { on } = useEmitter()
        on('foo', handleFoo)
      }
    }
    const Comp = {
      components: {
        Foo
      },
      template: '<div><Foo></Foo></div>',
      setup() {
        const { broadcast } = useEmitter()
        onMounted(() => {
          broadcast('foo', 1, 2)
        })
      }
    }
    mount(Comp)

    expect(handleFoo).toBeCalledWith(1, 2)
  })

  it('当使用 broadcast 时，如果 a 组件不是 b 组件的子组件的话，那么不会触发事件', () => {
    const handleFoo = jest.fn()
    const Foo = {
      template: '<div></div>',
      setup() {
        const { broadcast } = useEmitter()
        broadcast('foo')
      }
    }

    const Bar = {
      template: '<div></div>',
      setup() {
        const { on } = useEmitter()
        on('foo', handleFoo)
      }
    }
    const Comp = {
      components: {
        Foo,
        Bar
      },
      template: '<div><Foo></Foo><Bar></Bar></div>'
    }
    mount(Comp)

    expect(handleFoo).toBeCalledTimes(0)
  })

  it('子组件使用 dispatch 给父组件发消息，父组件应该可以接受到消息', () => {
    const handleFoo = jest.fn()
    const Foo = {
      template: '<div></div>',
      setup() {
        const { dispatch } = useEmitter()
        dispatch('foo', 1, 2)
      }
    }
    const Comp = {
      components: {
        Foo
      },
      template: '<div><Foo></Foo></div>',
      setup() {
        const { on } = useEmitter()
        on('foo', handleFoo)
      }
    }
    mount(Comp)

    expect(handleFoo).toBeCalledWith(1, 2)
  })

  it('当使用 dispatch 时，如果 a 组件不是 b 组件的父组件的话，那么不会触发事件', () => {
    const handleFoo = jest.fn()
    const Foo = {
      template: '<div></div>',
      setup() {
        const { dispatch } = useEmitter()
        dispatch('foo')
      }
    }

    const Bar = {
      template: '<div></div>',
      setup() {
        const { on } = useEmitter()
        on('foo', handleFoo)
      }
    }
    const Comp = {
      components: {
        Foo,
        Bar
      },
      template: '<div><Foo></Foo><Bar></Bar></div>'
    }
    mount(Comp)

    expect(handleFoo).toBeCalledTimes(0)
  })

  it('使用 off 可以删除对应的事件监听', () => {
    const Foo = {
      template: '<div></div>',
      setup() {
        const { dispatch } = useEmitter()
        dispatch('foo')
        dispatch('foo')
      }
    }

    let count = 0
    const Comp = {
      components: {
        Foo
      },
      template: '<div><Foo></Foo></div>',
      setup() {
        const { on, off } = useEmitter()
        const handleFoo = () => {
          // eslint-disable-next-line no-unused-vars
          count++
          off('foo', handleFoo)
        }

        on('foo', handleFoo)
      }
    }
    mount(Comp)

    expect(count).toBe(1)
  })

  it('once ', () => {
    const handleFoo = jest.fn()
    const Foo = {
      template: '<div></div>',
      setup() {
        const { dispatch } = useEmitter()
        dispatch('foo')
        dispatch('foo')
      }
    }
    const Comp = {
      components: {
        Foo
      },
      template: '<div><Foo></Foo></div>',
      setup() {
        const { once } = useEmitter()
        once('foo', handleFoo)
      }
    }
    mount(Comp)

    expect(handleFoo).toHaveBeenCalledTimes(1)
  })
})
