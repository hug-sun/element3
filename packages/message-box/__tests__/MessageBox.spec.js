import { mount } from '@vue/test-utils'
import MessageBox from '../src/main.vue'
describe('MessageBox.vue', () => {
  afterEach(() => {
    const el = document.querySelector('.el-message-box__wrapper')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
    if (el.__vue__) {
      el.__vue__.$destroy()
    }
  })

  test('kind of alert', async () => {
    const messagebox = await mount(MessageBox, {
      props: {
        title: 'title',
        message: 'message',
        _type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false
      }
    })
    expect(messagebox.find('.el-message-box__wrapper').exists()).toBe(true)
  })
})
