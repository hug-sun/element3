import { flushPromises } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import messageBox from '../src/MessageBox.js'
const selector = '.el-message-box__wrapper'
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
  })
  test('messageBox of message is html', async () => {
    let instanceProprety = ''
    const callback = jest.fn((action, instance) => {
      instanceProprety = instance
    })
    const { instance } = messageBox.alert(
      `<strong>这是 <i>HTML</i> 片段</strong>`,
      `html片段`,
      {
        dangerouslyUseHTMLString: true,
        callback
      }
    )
    expect(instance.proxy.message).toBe(
      '<strong>这是 <i>HTML</i> 片段</strong>'
    )
    expect(
      document.querySelector('.el-message-box__message').textContent
    ).toContain('HTML')
    expect(instance.proxy.title).toBe('html片段')
    expect(instance.proxy.dangerouslyUseHTMLString).toBeTruthy()
    instance.proxy.closeHandle()
    await nextTick()
    expect(instanceProprety.message).toBeTruthy()
    expect(callback).toHaveBeenCalled()
  })
  test('confirm', async () => {
    messageBox.confirm({
      type: 'warning',
      title: '消息',
      message: '这是一段内容'
    })
    const msgbox = document.querySelector(selector)
    const calsslist = msgbox.querySelector('.el-message-box__status').classList
    expect(calsslist.length).toEqual(2)
    expect(calsslist.contains('el-icon-warning')).toBeTruthy()
  })
  test('kind of prompt', async () => {
    let v = ''
    const callback = jest.fn(({ value }) => {
      v = value
    })
    const instance = messageBox.prompt('请输入邮箱', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'mmm',
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      inputErrorMessage: '邮箱格式不正确'
    })
    instance.then(callback)
    await nextTick()
    const btn = document.querySelector('.mmm')
    instance.instance.proxy.inputValue = '4091'
    await btn.click()
    await flushPromises()
    expect(callback).not.toHaveBeenCalled()
    instance.instance.proxy.inputValue = '409187100@qq.com'
    await btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
    expect(v).toBeTruthy()
  })
  test('was invoked', async () => {
    const callback = jest.fn(() => {})
    const instance = messageBox.prompt('请输入邮箱', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      cancelButtonClass: 'mmm',
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      inputErrorMessage: '邮箱格式不正确'
    })
    instance.catch(callback)
    await nextTick()
    const btn = document.querySelector('.mmm')
    await btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
  })
  test('paramter', async () => {
    const instance = messageBox.alert('请输入邮箱', { title: 'aaa' })
    expect(instance.instance.proxy.title).toBe('aaa')
    expect(instance.instance.proxy.message).toBe('请输入邮箱')
  })
  test('showInput is false', async () => {
    const callback = jest.fn(() => {})
    const instance = messageBox.confirm('请输入邮箱', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'mmm'
    })
    instance.then(callback)
    const btn = document.querySelector('.mmm')
    await btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
  })
  test('message is vnode', async () => {
    const v = h('div', '4')
    const { instance } = messageBox.alert({
      message: v
    })
    expect(instance.proxy.$slots.default()[0]).toEqual(v)
  })
})
