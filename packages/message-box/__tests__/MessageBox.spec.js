import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import MessageBox from '../src/MessageBox.vue'
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
    const messagebox = mount(MessageBox, {
      props: {
        title: 'title',
        message: 'message',
        _type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false
      }
    })
    const _messagebox = messagebox.find('.el-message-box__message')
    expect(_messagebox.text()).toBe('message')
    expect(messagebox.find('.el-message-box__wrapper').exists()).toBe(true)
  })

  test('dangerouslyUseHTMLString', async () => {
    const messagebox = mount(MessageBox, {
      props: {
        title: 'title',
        message: '<div>message</div>',
        _type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true
      }
    })
    const _messagebox = messagebox.find('.el-message-box__message')
    expect(_messagebox.text()).toBe('message')
  })

  test('test dome click', async () => {
    const callBackAction = ref(null)
    const messagebox = mount(MessageBox, {
      props: {
        title: 'title',
        message: '<div>message</div>',
        _type: 'alert',
        cancelButtonClass: 'el-cccc',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        showCancelButton: true,
        dangerouslyUseHTMLString: true,
        callback: (action) => {
          callBackAction.value = action
        }
      }
    })
    await messagebox.find('.el-cccc').trigger('click')
    const w = messagebox.find('.el-message-box__title span')
    expect(w.text()).toBe('title')
    setTimeout(() => {
      expect(callBackAction.value).toBe('cancel')
    })
  })
})
