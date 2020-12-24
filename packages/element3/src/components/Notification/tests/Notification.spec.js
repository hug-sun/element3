import { Notification } from '../src/Notification.js'
import { h } from 'vue'

describe('Notification.js', () => {
  afterEach(async () => {
    Notification.closeAll()
  })
  it('should have close function in the notification instance', () => {
    const instanceProxy = Notification('foo')
    expect(instanceProxy.close).toBeTruthy()
  })

  it('default options ', () => {
    const instanceProxy = Notification('foo')

    expect(instanceProxy.$props.position).toBe('top-right')
    expect(instanceProxy.$props.message).toBe('foo')
    expect(instanceProxy.$props.duration).toBe(4500)
    expect(instanceProxy.$props.verticalOffset).toBe(16)
  })

  it('message is vnode', () => {
    const vnode = h('p')
    const instanceProxy = Notification({ message: vnode })
    const slotDefault = instanceProxy.$slots.default()[0]
    expect(slotDefault).toEqual(vnode)
  })

  it('options is vnode', () => {
    const vnode = h('p')
    const instanceProxy = Notification(vnode)
    const slotDefault = instanceProxy.$slots.default()[0]
    expect(slotDefault).toEqual(vnode)
  })

  it('should called onClose ', () => {
    let proxy
    const onClose = jest.fn((instanceProxy) => {
      proxy = instanceProxy
    })

    const instanceProxy = Notification({
      message: 'foo',
      onClose
    })
    instanceProxy.close()

    expect(proxy.close).toBeTruthy()
    expect(onClose).toHaveBeenCalled()
  })

  it('should called onClick ', () => {
    let proxy
    const onClick = jest.fn((instanceProxy) => {
      proxy = instanceProxy
    })

    const instanceProxy = Notification({
      message: 'foo',
      onClick
    })
    instanceProxy.click()

    expect(proxy.click).toBeTruthy()
    expect(onClick).toHaveBeenCalled()
  })

  it('calculateVerticalOffset', () => {
    const instanceProxy1 = Notification('foo1')
    expect(instanceProxy1.verticalOffset).toBe(16)

    const instanceProxy2 = Notification('foo2')
    expect(instanceProxy2.verticalOffset).toBe(32)
  })

  describe('message.info', () => {
    test('string', () => {
      const instanceProxy = Notification.info('foo')

      expect(instanceProxy.$props.type).toBe('info')
      expect(instanceProxy.$props.message).toBe('foo')
    })

    test('options', () => {
      const instanceProxy = Notification.info({
        message: 'foo'
      })

      expect(instanceProxy.$props.type).toBe('info')
      expect(instanceProxy.$props.message).toBe('foo')
    })
  })

  test('message.success', () => {
    const instanceProxy = Notification.success('foo')

    expect(instanceProxy.$props.type).toBe('success')
    expect(instanceProxy.$props.message).toBe('foo')
  })

  test('message.warning', () => {
    const instanceProxy = Notification.warning('foo')

    expect(instanceProxy.$props.type).toBe('warning')
    expect(instanceProxy.$props.message).toBe('foo')
  })

  test('message.error', () => {
    const instanceProxy = Notification.error('foo')

    expect(instanceProxy.$props.type).toBe('error')
    expect(instanceProxy.$props.message).toBe('foo')
  })
})
