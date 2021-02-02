import { Message } from '../src/Message.js'
import { h } from 'vue'
describe('Message', () => {
  afterEach(async () => {
    Message.closeAll()
  })
  test('should have close function in the message instance', () => {
    const instanceProxy = Message('foo')
    expect(instanceProxy.proxy.popup.close).toBeTruthy()
  })
  test('default options ', () => {
    const instanceProxy = Message('foo')

    expect(instanceProxy.proxy.popup.$props.type).toBe('info')
    expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
    expect(instanceProxy.proxy.popup.$props.duration).toBe(4500)
    expect(instanceProxy.proxy.popup.$props.offset).toBe(20)
  })

  test('message is vnode', () => {
    const vnode = h('p')
    Message({
      message: vnode
    })

    expect(document.querySelector('.el-message--info')).toBeTruthy()
  })

  test('opts is vnode', () => {
    const vnode = h('p')
    Message(vnode)

    expect(document.querySelector('.el-message--info')).toBeTruthy()
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
    instanceProxy.proxy.popup.close()

    expect(proxy.close).toBeTruthy()
    expect(onClose).toHaveBeenCalled()
  })

  test('calculateVerticalOffset', () => {
    const instanceProxy1 = Message('foo1')
    expect(instanceProxy1.proxy.popup.offset).toBe(20)

    const instanceProxy2 = Message('foo2')
    expect(instanceProxy2.proxy.popup.offset).toBe(36)
  })

  describe('message.info', () => {
    test('string', () => {
      const instanceProxy = Message.info('foo')

      expect(instanceProxy.proxy.popup.$props.type).toBe('info')
      expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
    })

    test('options', () => {
      const instanceProxy = Message.info({
        message: 'foo'
      })

      expect(instanceProxy.proxy.popup.$props.type).toBe('info')
      expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
    })
  })

  test('message.success', () => {
    const instanceProxy = Message.success('foo')

    expect(instanceProxy.proxy.popup.$props.type).toBe('success')
    expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
  })

  test('message.warning', () => {
    const instanceProxy = Message.warning('foo')

    expect(instanceProxy.proxy.popup.$props.type).toBe('warning')
    expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
  })

  test('message.error', () => {
    const instanceProxy = Message.error('foo')

    expect(instanceProxy.proxy.popup.$props.type).toBe('error')
    expect(instanceProxy.proxy.popup.$props.message).toBe('foo')
  })
})
