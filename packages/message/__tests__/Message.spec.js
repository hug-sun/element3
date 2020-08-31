import '@testing-library/jest-dom'
import Utils from 'main/utils/aria-utils'
import Message from '../index.js'

describe('Message', () => {
  afterEach(() => {
    const el = document.querySelector('.el-message')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  })

  it('automatically close', (done) => {
    Message({
      message: '灰风',
      duration: 500
    })
    const message = document.querySelector('.el-message__content')
    expect(document.querySelector('.el-message')).toBeVisible()
    expect(message.textContent).toBe('灰风')
    setTimeout(() => {
      expect(document.querySelector('.el-message')).toBeNull()
      done()
    }, 1000)
  })

  it('manually close', (done) => {
    Message({
      message: '夏天',
      showClose: true
    })
    setTimeout(() => {
      document.querySelector('.el-message__closeBtn').click()
      setTimeout(() => {
        expect(document.querySelector('.el-message')).toBeNull()
        done()
      }, 500)
    }, 500)
  })

  it('custom icon', (done) => {
    Message({
      message: '夏天',
      iconClass: 'el-icon-close'
    })
    setTimeout(() => {
      const icon = document.querySelector('.el-message i')
      expect(icon.classList).toContain('el-icon-close')
      done()
    }, 500)
  })

  it('html string', () => {
    Message({
      message: '<strong>夏天</strong>',
      dangerouslyUseHTMLString: true
    })
    const message = document.querySelector('.el-message strong')
    expect(message.textContent).toBe('夏天')
  })

  it('close all', (done) => {
    Message({
      message: '夏天',
      duration: 0
    })
    Message({
      message: '淑女',
      duration: 0
    })
    setTimeout(() => {
      Message.closeAll()
      setTimeout(() => {
        expect(document.querySelector('.el-message')).toBeNull()
        done()
      }, 500)
    }, 500)
  })

  it('create', () => {
    Message('娜梅莉亚')
    expect(document.querySelector('.el-message')).toBeVisible()
  })

  it('invoke with type', () => {
    Message.success('毛毛狗')
    expect(document.querySelector('.el-message').classList).toContain(
      'el-message--success'
    )
  })

  it('center', () => {
    Message({
      message: '夏天',
      center: true,
      duration: 0
    })
    expect(document.querySelector('.el-message').classList).toContain(
      'is-center'
    )
  })

  it('reset timer', (done) => {
    Message({
      message: '白灵',
      duration: 1000
    })
    setTimeout(() => {
      Utils.triggerEvent(document.querySelector('.el-message'), 'mouseenter')
      setTimeout(() => {
        expect(document.querySelector('.el-message')).toBeVisible()
        done()
      }, 700)
    }, 500)
  })
})
