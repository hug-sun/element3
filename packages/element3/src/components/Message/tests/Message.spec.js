import { Message } from '../src/Message.js'
import { h } from 'vue'
describe('Message', () => {
  afterEach(async () => {
    Message.closeAll()
  })
  test('should have close function in the message instance', () => {
    const instanceProxy = Message('foo')

    expect(instanceProxy.close).toBeTruthy()
  })
  test('default options ', () => {
    const instanceProxy = Message('foo')

    expect(instanceProxy.$props.type).toBe('info')
    expect(instanceProxy.$props.message).toBe('foo')
    expect(instanceProxy.$props.duration).toBe(4500)
    expect(instanceProxy.$props.offset).toBe(20)
  })

  test('message is vnode', () => {
    const vnode = h('p')
    const instanceProxy = Message({
      message: vnode
    })

    const slotDefault = instanceProxy.$slots.default()[0]
    expect(slotDefault).toEqual(vnode)
  })

  test('opts is vnode', () => {
    const vnode = h('p')
    const instanceProxy = Message(vnode)

    const slotDefault = instanceProxy.$slots.default()[0]
    expect(slotDefault).toEqual(vnode)
  })

  test('should called onClose ', () => {
    let proxy
    const onClose = jest.fn((instanceProxy) => {
      proxy = instanceProxy
    })

    const instanceProxy = Message({
      message: 'foo',
      onClose
    })
    instanceProxy.close()

    expect(proxy.close).toBeTruthy()
    expect(onClose).toHaveBeenCalled()
  })

  test('calculateVerticalOffset', () => {
    const instanceProxy1 = Message('foo1')
    expect(instanceProxy1.offset).toBe(20)

    const instanceProxy2 = Message('foo2')
    expect(instanceProxy2.offset).toBe(36)
  })

  describe('message.info', () => {
    test('string', () => {
      const instanceProxy = Message.info('foo')

      expect(instanceProxy.$props.type).toBe('info')
      expect(instanceProxy.$props.message).toBe('foo')
    })

    test('options', () => {
      const instanceProxy = Message.info({
        message: 'foo'
      })

      expect(instanceProxy.$props.type).toBe('info')
      expect(instanceProxy.$props.message).toBe('foo')
    })
  })

  test('message.success', () => {
    const instanceProxy = Message.success('foo')

    expect(instanceProxy.$props.type).toBe('success')
    expect(instanceProxy.$props.message).toBe('foo')
  })

  test('message.warning', () => {
    const instanceProxy = Message.warning('foo')

    expect(instanceProxy.$props.type).toBe('warning')
    expect(instanceProxy.$props.message).toBe('foo')
  })

  test('message.error', () => {
    const instanceProxy = Message.error('foo')

    expect(instanceProxy.$props.type).toBe('error')
    expect(instanceProxy.$props.message).toBe('foo')
  })
})
