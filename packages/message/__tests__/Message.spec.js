import '@testing-library/jest-dom'
import { nextTick } from 'vue'
import Utils from 'main/utils/aria-utils'
import Message from '../index.js'

jest.useFakeTimers()

describe('Message', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    const el = document.querySelector('.el-message')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  })

  it('automatically close', async (done) => {
    const instance = Message({
      message: '灰风',
      duration: 500
    })
    const message = document.querySelector('.el-message__content')
    expect(document.querySelector('.el-message')).toBeVisible()
    expect(message.textContent).toBe('灰风')
    jest.runAllTimers()
    await nextTick()
    expect(instance.component.ctx.visible).toBe(false)
    done()
  })

  it('manually close', async (done) => {
    const instance = Message({
      message: '夏天',
      showClose: true
    })
    jest.advanceTimersByTime(500)
    document.querySelector('.el-message__closeBtn').click()
    await nextTick()
    expect(instance.component.ctx.visible).toBe(false)
    done()
  })

  it('custom icon', (done) => {
    Message({
      message: '夏天',
      iconClass: 'el-icon-close'
    })
    const icon = document.querySelector('.el-message i')
    expect(icon.classList).toContain('el-icon-close')
    done()
  })

  it('html string', () => {
    Message({
      message: '<strong>夏天</strong>',
      dangerouslyUseHTMLString: true
    })
    const message = document.querySelector('.el-message strong')
    expect(message.textContent).toBe('夏天')
  })

  it('close all', async (done) => {
    const instance1 = Message({
      message: '夏天',
      duration: 0
    })
    const instance2 = Message({
      message: '淑女',
      duration: 0
    })
    jest.advanceTimersByTime(500)
    Message.closeAll()
    await nextTick()
    expect(instance1.component.ctx.visible).toBe(false)
    expect(instance2.component.ctx.visible).toBe(false)
    done()
  })

  it('create', () => {
    Message('娜梅莉亚')
    expect(document.querySelector('.el-message')).toBeVisible()
  })

  it('invoke with type', () => {
    const instance = Message.success('毛毛狗')
    expect(instance.component.ctx.type).toBe('success')
  })

  it('center', () => {
    const wrapper = Message({
      message: '夏天',
      center: true,
      duration: 0
    })
    nextTick(() => {
      expect(wrapper.classes()).toContain('is-center')
    })
  })

  it('reset timer', async (done) => {
    const instance = Message({
      message: '白灵',
      duration: 1000
    })
    jest.advanceTimersByTime(500)
    Utils.triggerEvent(document.querySelector('.el-message'), 'mouseenter')
    jest.clearAllTimers()
    jest.advanceTimersByTime(700)
    await nextTick()
    expect(instance.component.ctx.visible).toBe(true)
    done()
  })
})
