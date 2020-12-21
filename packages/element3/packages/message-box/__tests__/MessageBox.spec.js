// import { mount } from '@vue/test-utils'
import messageBox from '../src/MessageBox.js'
const selector = '.el-message-box__wrapper'
const sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))
describe('MessageBox.js', () => {
  afterEach(() => {
    const el = document.querySelector('.el-message-box__wrapper')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
    messageBox.close()
  })
  test('alert', async () => {
    messageBox.alert({
      type: 'warning',
      title: '消息',
      message: '这是一段内容'
    })
    const msgbox = document.querySelector(selector)
    expect(
      msgbox.querySelector('.el-message-box__title span').textContent
    ).toEqual('消息')
    expect(
      msgbox.querySelector('.el-message-box__message').querySelector('p')
        .textContent
    ).toEqual('这是一段内容')
    messageBox.close()
    await sleep(50)
    expect(msgbox.style.display).toEqual('none')
  })
})
