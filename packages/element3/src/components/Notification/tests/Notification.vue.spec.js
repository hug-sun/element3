import { mount, flushPromises } from '@vue/test-utils'
import Notification from '../src/Notification.vue'
import { h } from 'vue'

describe('Notification.vue', () => {
  test('snapshot', () => {
    const wrapper = mount(Notification)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('title', () => {
    const title = 'this is a title'
    const wrapper = mount(Notification, {
      props: {
        title
      }
    })
    expect(wrapper.get('.el-notification__title').text()).toContain(title)
  })

  it('the message type is string', () => {
    const message = 'this is a message'
    const wrapper = mount(Notification, {
      props: {
        message
      }
    })
    expect(wrapper.get('.el-notification__content').text()).toContain(message)
  })

  it('the message type is VNode', () => {
    const message = h('p', 'foo')
    const wrapper = mount(Notification, {
      slots: {
        default: message
      }
    })
    expect(wrapper.get('.el-notification__content').get('p').html()).toContain(
      '<p>foo</p>'
    )
  })

  it('dangerouslyUseHTMLString', () => {
    const wrapper = mount(Notification, {
      props: {
        dangerouslyUseHTMLString: true,
        message: "<div id='foo'>foo</div>"
      }
    })
    expect(wrapper.find('#foo').exists()).toBe(true)
  })

  describe('type', () => {
    test('show type icon', () => {
      const type = 'info'
      const wrapper = mount(Notification, {
        props: {
          type
        }
      })

      expect(wrapper.find(`.el-icon-${type}`).exists()).toBe(true)
      expect(wrapper.find('.el-notification__icon').exists()).toBe(true)
    })
  })

  it('iconClass', () => {
    const iconClass = 'el-icon-setting'
    const wrapper = mount(Notification, {
      props: {
        iconClass
      }
    })
    expect(wrapper.find(`.${iconClass}`).exists()).toBe(true)
    expect(wrapper.find('.el-notification__icon').exists()).toBe(true)
  })

  it('iconClass should be overridden', () => {
    const type = 'info'
    const iconClass = 'el-icon-setting'
    const wrapper = mount(Notification, {
      props: {
        type,
        iconClass
      }
    })
    expect(wrapper.find(`.el-icon-${type}`).exists()).toBe(true)
    expect(wrapper.find(`.${iconClass}`).exists()).toBe(false)
    expect(wrapper.find('.el-notification__icon').exists()).toBe(true)
  })

  it('customize the name of the class', () => {
    const customClass = 'foo'
    const wrapper = mount(Notification, {
      props: {
        customClass
      }
    })
    expect(wrapper.get('.el-notification').classes()).toContain(customClass)
  })

  it('position', () => {
    const position = 'bottom-right'
    const wrapper = mount(Notification, {
      props: {
        position
      }
    })
    expect(wrapper.find('.el-notification').classes()).toContain('right')
    expect(wrapper.vm.verticalProperty).toBe('bottom')
    expect(wrapper.find('.el-notification').element.style.bottom).toBe('0px')
  })

  it('verticalOffset', () => {
    const verticalOffset = 50
    const wrapper = mount(Notification, {
      props: {
        verticalOffset
      }
    })
    expect(wrapper.vm.verticalProperty).toBe('top')
    expect(wrapper.find('.el-notification').element.style.top).toBe(
      `${verticalOffset}px`
    )
  })

  it('set both position and verticalOffset', () => {
    const position = 'bottom-right'
    const verticalOffset = 50
    const wrapper = mount(Notification, {
      props: {
        position,
        verticalOffset
      }
    })
    expect(wrapper.vm.verticalProperty).toBe('bottom')
    expect(wrapper.find('.el-notification').element.style.bottom).toBe(
      `${verticalOffset}px`
    )
  })

  it('update verticalOffset', async () => {
    const wrapper = mount(Notification, {
      props: {
        verticalOffset: 50
      }
    })
    expect(wrapper.find('.el-notification').element.style.top).toBe('50px')
    wrapper.vm.verticalOffsetVal = 100
    await flushPromises()
    expect(wrapper.find('.el-notification').element.style.top).toBe('100px')
  })

  describe('close', () => {
    it('set the showClose ', () => {
      const showClose = true
      const wrapper = mount(Notification, {
        props: {
          showClose
        }
      })
      expect(wrapper.find('.el-notification__closeBtn').exists()).toBe(true)
      expect(wrapper.find('.el-icon-close').exists()).toBe(true)
    })

    it('click close btn', async () => {
      const showClose = true
      const wrapper = mount(Notification, {
        props: {
          showClose
        }
      })
      const closeBtn = wrapper.get('.el-notification__closeBtn')
      await closeBtn.trigger('click')
      expect(wrapper.get('.el-notification').isVisible()).toBe(false)
    })

    it('set the duration to 1000, notification is closed when in 1000ms', async () => {
      jest.useFakeTimers()

      const wrapper = mount(Notification, {
        props: {
          duration: 1000
        }
      })
      jest.runTimersToTime(1000)
      await flushPromises()
      expect(wrapper.get('.el-notification').isVisible()).toBe(false)
    })

    it('set the duration to 0, the Notification does not turn off ', async () => {
      jest.useFakeTimers()
      const wrapper = mount(Notification, {
        props: {
          duration: 0
        }
      })
      jest.runTimersToTime(5000)
      await flushPromises()
      expect(wrapper.get('.el-notification').isVisible()).toBe(true)
    })

    it('should called onClose', () => {
      let proxy
      const onClose = (componentInstance) => {
        proxy = componentInstance.proxy
      }
      const wrapper = mount(Notification, {
        props: {
          onClose,
          showClose: true
        }
      })
      wrapper.get('.el-notification__closeBtn').trigger('click')
      expect(proxy.close).toBeTruthy()
    })
  })

  describe('notification onClick', () => {
    it('should called onClick', () => {
      let proxy
      const onClick = (componentInstance) => {
        proxy = componentInstance.proxy
      }
      const wrapper = mount(Notification, {
        props: {
          onClick,
          showClose: true
        }
      })
      wrapper.get('.el-notification').trigger('click')
      expect(proxy.click).toBeTruthy()
    })
  })

  it('should close notification when call close function in the componentInstance', async () => {
    const wrapper = mount(Notification)

    wrapper.vm.close()
    await flushPromises()
    expect(wrapper.get('.el-notification').isVisible()).toBe(false)
  })

  it('should clear timeout', () => {
    jest.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        duration: 1000,
        showClose: true
      }
    })

    wrapper.get('.el-notification__closeBtn').trigger('click')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')[0][0].proxy.close).toBeTruthy()
  })

  it('should not closed when mouseenter', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        duration: 1000
      }
    })

    wrapper.get('.el-notification').trigger('mouseenter')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should closed when mouseleave', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        duration: 1000
      }
    })

    wrapper.get('.el-notification').trigger('mouseenter')
    wrapper.get('.el-notification').trigger('mouseleave')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('keyCode is 46', async () => {
    jest.useFakeTimers()
    const wrapper = mount(Notification)
    wrapper.get('.el-notification').trigger('keydown', { keyCode: 46 })

    jest.runTimersToTime(5000)
    await flushPromises()
    expect(wrapper.get('.el-notification').isVisible()).toBe(true)
  })
  it('keyCode is 27', async () => {
    let proxy
    const onClose = (componentInstance) => {
      proxy = componentInstance.proxy
    }
    const wrapper = mount(Notification, {
      props: {
        onClose
      }
    })
    wrapper.get('.el-notification').trigger('keydown', { keyCode: 27 })
    expect(proxy.close).toBeTruthy()
  })

  it('keyCode is 100', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Notification)
    jest.runTimersToTime(4500)
    await flushPromises()

    wrapper.get('.el-notification').trigger('keydown', { keyCode: 100 })
    expect(wrapper.get('.el-notification').isVisible()).toBe(false)
  })
})
