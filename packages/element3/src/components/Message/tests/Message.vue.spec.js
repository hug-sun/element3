import { mount, flushPromises } from '@vue/test-utils'
import Message from '../src/Message.vue'
import { h } from 'vue'

describe('Message.vue', () => {
  test('snapshot', () => {
    const wrapper = mount(Message)
    expect(wrapper.element).toMatchSnapshot()
  })
  test('message', () => {
    const message = 'this is a message'

    const wrapper = mount(Message, {
      props: {
        message
      }
    })

    expect(wrapper.get('.el-message__content').text()).toContain(message)
  })

  test('message is vnode', () => {
    const message = h('p', { class: 'el-message__content' }, 'foo')

    const wrapper = mount(Message, {
      slots: {
        default: message
      }
    })

    expect(wrapper.get('.el-message__content').html()).toContain(
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

      expect(wrapper.find(`.el-icon-${type}`).exists()).toBe(true)
      expect(wrapper.find('.el-message__icon').exists()).toBe(true)
      expect(wrapper.get('.el-message').classes()).toContain(`el-message--info`)
    })
  })

  test('iconClass', () => {
    const wrapper = mount(Message, {
      props: {
        iconClass: 'el-icon-setting',
        type: 'info'
      }
    })

    expect(wrapper.find('.el-icon-setting').exists()).toBe(true)
  })

  test('should just icon is exists ', () => {
    const wrapper = mount(Message, {
      props: {
        iconClass: 'el-icon-setting',
        type: 'info'
      }
    })

    expect(wrapper.find('.el-icon-setting').exists()).toBe(true)
    expect(wrapper.find('.el-icon-info').exists()).toBe(false)
    expect(wrapper.get('.el-message').classes()).not.toContain(
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

      expect(wrapper.find('.el-message__closeBtn').exists()).toBe(true)
      expect(wrapper.find('.el-icon-close').exists()).toBe(true)
      expect(wrapper.get('.el-message').classes()).toContain('is-closable')
    })

    test('click close btn', async () => {
      const wrapper = mount(Message, {
        props: {
          showClose: true
        }
      })

      const closeBtn = wrapper.get('.el-message__closeBtn')
      await closeBtn.trigger('click')
      expect(wrapper.get('.el-message').isVisible()).toBe(false)
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
      expect(wrapper.get('.el-message').isVisible()).toBe(false)
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

      wrapper.get('.el-message__closeBtn').trigger('click')
      expect(proxy.close).toBeTruthy()
    })

    test('should close message when call close function in the componentInstance ', async () => {
      const wrapper = mount(Message)

      wrapper.vm.close()
      await flushPromises()
      expect(wrapper.get('.el-message').isVisible()).toBe(false)
    })

    test('should clear timeout', () => {
      jest.useFakeTimers()

      const wrapper = mount(Message, {
        props: {
          duration: 1000,
          showClose: true
        }
      })

      wrapper.get('.el-message__closeBtn').trigger('click')
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

    expect(wrapper.get('.el-message').classes()).toContain('is-center')
  })

  test('customize the name of the class', () => {
    const wrapper = mount(Message, {
      props: {
        customClass: 'foo '
      }
    })

    expect(wrapper.get('.el-message').classes()).toContain('foo')
  })

  test('dangerouslyUseHTMLString', () => {
    const wrapper = mount(Message, {
      props: {
        dangerouslyUseHTMLString: true,
        message: "<div id='foo'>foo</div>"
      }
    })

    expect(wrapper.find('#foo').exists()).toBe(true)
  })

  test('verticalOffset', () => {
    const wrapper = mount(Message, {
      props: {
        offset: 50
      }
    })

    expect(wrapper.get('.el-message')).toHaveStyle({
      top: '50px'
    })
  })

  test('update offset when called updateVerticalOffset', async () => {
    const wrapper = mount(Message, {
      props: {
        offset: 50
      }
    })

    expect(wrapper.get('.el-message')).toHaveStyle({
      top: '50px'
    })
    wrapper.vm.offsetVal = 100
    await flushPromises()
    expect(wrapper.get('.el-message')).toHaveStyle({
      top: '100px'
    })
  })

  test('should not closed when mouseenter ', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Message, {
      props: {
        duration: 1000
      }
    })

    wrapper.get('.el-message').trigger('mouseenter')
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

    wrapper.get('.el-message').trigger('mouseenter')
    wrapper.get('.el-message').trigger('mouseleave')
    jest.runTimersToTime(1000)
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
