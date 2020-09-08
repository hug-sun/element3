import { mount } from '@vue/test-utils'
import Notification from '../Notification.vue'

describe('Notification', () => {
  afterEach(() => {
    const el = document.querySelector('.el-notification')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
    if (el.__vue__) {
      el.__vue__.$destroy()
    }
  })

  test('automatically close', async (done) => {
    const notification = await mount(Notification, {
      props: {
        message: '玻璃蜡烛',
        duration: 500
      }
    })
    expect(notification.find('.el-notification').exists()).toBe(true)
    setTimeout(() => {
      // 此处2.x的用例测试是否存在，看实现close效果为display：none
      // expect(notification.find('.el-notification').exists()).toBe(false)
      expect(notification.find('.el-notification').element.style.display).toBe(
        'none'
      )
      done()
    }, 1000)
  })

  test('manually close', async (done) => {
    const notification = await mount(Notification, {
      props: {
        message: '苍白母马'
      }
    })
    notification.find('.el-notification__closeBtn').trigger('click')
    setTimeout(() => {
      expect(notification.find('.el-notification').element.style.display).toBe(
        'none'
      )
      done()
    }, 500)
  })

  test('create', () => {
    const notification = mount(Notification, {
      props: {
        title: '狮子',
        message: '狮鹫',
        duration: 0
      }
    })
    const group = notification.find('.el-notification__group')
    const title = group.find('.el-notification__title')
    const message = group.find('.el-notification__content p')
    expect(notification.find('.el-notification').exists()).toBe(true)
    expect(title.text()).toBe('狮子')
    expect(message.text()).toBe('狮鹫')
  })

  test('html string as message', () => {
    const notification = mount(Notification, {
      props: {
        title: '狮子',
        message: '<strong>狮鹫</strong>',
        dangerouslyUseHTMLString: true,
        duration: 0
      }
    })
    const message = notification.find('.el-notification__content strong')
    expect(message.text()).toBe('狮鹫')
  })

  // 怀疑2.x版本以下用例的功能未实现
  // create by vnode
  // alias by vnode
  // invoke with type

  test('reset timer', async (done) => {
    const notification = await mount(Notification, {
      props: {
        message: '芳香总管',
        duration: 1000
      }
    })
    notification.find('.el-notification').trigger('mouseenter')
    setTimeout(() => {
      notification.find('.el-notification').trigger('mouseleave')
      expect(notification.find('.el-notification').exists()).toBe(true)
      done()
    }, 700)
  })

  test('no close button', async () => {
    const notification = await mount(Notification, {
      props: {
        message: 'Hello',
        showClose: false
      }
    })
    expect(notification.find('.el-notification__closeBtn').exists()).toBe(false)
  })
})
