import { mount, flushPromises } from '@vue/test-utils'
import Message from '../src/Message.vue'
import { h } from 'vue'

Element.prototype.trigger = function (eventName) {
  this.dispatchEvent(new Event(eventName))
}

describe('Message.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('snapshot', () => {
    mount(Message)

    expect(document.querySelector('.el-message').innerHTML).toMatchSnapshot()
  })
  test('message', () => {
    const message = 'this is a message'

    const wrapper = mount(Message, {
      props: {
        message
      }
    })

    expect(document.querySelector('.el-message__content').innerHTML).toContain(
      message
    )
  })

  test('message is vnode', () => {
    const message = h('p', { class: 'el-message__content' }, 'foo')

    const wrapper = mount(Message, {
      slots: {
        default: message
      }
    })

    expect(document.querySelector('.el-message').innerHTML).toContain(
      '<p class="el-message__content">foo</p>'
    )
  })

  describe('type', () => {
    test('show type icon', () => {
      const type = 'info'
      const wrapper = mount(Message, {
        props: {
          type
        }
      })

      expect(document.querySelector(`.el-icon-${type}`)).not.toBeNull()
      expect(document.querySelector('.el-message__icon')).not.toBeNull()
      expect(document.querySelector('.el-message').classList).toContain(
        `el-message--info`
      )
    })
  })

  test('iconClass', () => {
    const wrapper = mount(Message, {
      props: {
        iconClass: 'el-icon-setting',
        type: 'info'
      }
    })

    expect(document.querySelector('.el-icon-setting')).not.toBeNull()
  })

  test('should just icon is exists ', () => {
    const wrapper = mount(Message, {
      props: {
        iconClass: 'el-icon-setting',
        type: 'info'
      }
    })

    expect(document.querySelector('.el-icon-setting')).not.toBeNull()
    expect(document.querySelector('.el-icon-info')).toBeNull()
    expect(document.querySelector('.el-message').classList).not.toContain(
      'el-message--info'
    )
  })

  describe('close', () => {
    test('showClose ', () => {
      const wrapper = mount(Message, {
        props: {
          showClose: true
        }
      })

      expect(
        document.querySelector('.el-message__closeBtn').classList
      ).not.toBeNull()
      expect(document.querySelector('.el-icon-close').classList).not.toBeNull()
      expect(document.querySelector('.el-message').classList).toContain(
        'is-closable'
      )
    })

    test('click close btn', async () => {
      const wrapper = mount(Message, {
        props: {
          showClose: true
        }
      })

      const closeBtn = document.querySelector('.el-message__closeBtn')
      await closeBtn.trigger('click')
      expect(document.querySelector('.el-message').style.display).toBe('none')
    })

    test('duration: message is closed when in 1000ms', async () => {
      jest.useFakeTimers()

      const wrapper = mount(Message, {
        props: {
          duration: 1000
        }
      })
      jest.runTimersToTime(1000)
      await flushPromises()
      expect(document.querySelector('.el-message').style.display).toBe('none')
    })

    test('should called onClose', () => {
      let proxy
      const onClose = (componentInstance) => {
        proxy = componentInstance.proxy
      }
      const wrapper = mount(Message, {
        props: {
          onClose,
          showClose: true
        }
      })

      document.querySelector('.el-message__closeBtn').trigger('click')
      expect(proxy.close).toBeTruthy()
    })

    test('should close message when call close function in the componentInstance ', async () => {
      const wrapper = mount(Message)

      wrapper.vm.close()
      await flushPromises()
      expect(document.querySelector('.el-message').style.display).toBe('none')
    })

    test('should clear timeout', () => {
      jest.useFakeTimers()

      const wrapper = mount(Message, {
        props: {
          duration: 1000,
          showClose: true
        }
      })

      document.querySelector('.el-message__closeBtn').trigger('click')
      jest.runTimersToTime(1000)
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')[0][0].proxy.close).toBeTruthy()
    })
  })

  test('conter', () => {
    const wrapper = mount(Message, {
      props: {
        center: true
      }
    })

    expect(document.querySelector('.el-message').classList).toContain(
      'is-center'
    )
  })

  test('customize the name of the class', () => {
    const wrapper = mount(Message, {
      props: {
        customClass: 'foo '
      }
    })

    expect(document.querySelector('.el-message').classList).toContain('foo')
  })

  test('dangerouslyUseHTMLString', () => {
    const wrapper = mount(Message, {
      props: {
        dangerouslyUseHTMLString: true,
        message: "<div id='foo'>foo</div>"
      }
    })

    expect(document.querySelector('#foo')).not.toBeNull()
  })

  test('verticalOffset', () => {
    const wrapper = mount(Message, {
      props: {
        offset: 50
      }
    })

    expect(document.querySelector('.el-message').style.top).toEqual('50px')
  })

  test('update offset when called updateVerticalOffset', async () => {
    const wrapper = mount(Message, {
      props: {
        offset: 50
      }
    })

    expect(document.querySelector('.el-message').style.top).toEqual('50px')
    wrapper.vm.offsetTop = 100
    await flushPromises()
    expect(document.querySelector('.el-message').style.top).toEqual('100px')
  })

  test('should not closed when mouseenter ', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Message, {
      props: {
        duration: 1000
      }
    })

    document.querySelector('.el-message').trigger('mouseenter')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  test('should  closed when mouseleave ', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Message, {
      props: {
        duration: 1000
      }
    })

    document.querySelector('.el-message').trigger('mouseenter')
    document.querySelector('.el-message').trigger('mouseleave')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
