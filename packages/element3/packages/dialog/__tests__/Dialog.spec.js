import { mount } from '@vue/test-utils'
import Dialog from '../Dialog.vue'
describe('Dialog', () => {
  test('Dialog create', async () => {
    const dialog = await mount(Dialog, {
      props: {
        title: 'dialog test',
        visible: true
      }
    })

    expect(dialog.props().title).toBe('dialog test')
    expect(dialog.find('.el-dialog__title').text()).toBe('dialog test')
  })

  it('closeOnClickModal', () => {
    const wrapper = mount(Dialog, {
      props: {
        closeOnClickModal: false,
        visible: true
      }
    })
    wrapper.find('.el-dialog__wrapper').trigger('click')
    expect(wrapper.componentVM.visible).toBe(true)
  })

  it('Dialog slot', async () => {
    const wrapper = await mount(Dialog, {
      slots: {
        footer: 'SoltFooter'
      }
    })
    expect(wrapper.find('.el-dialog__footer').text()).toBe('SoltFooter')
  })

  it('showClose', () => {
    const wrapperTrue = mount(Dialog, {
      props: {
        showClose: false
      }
    })

    expect(wrapperTrue.find('.el-dialog__headerbtn').exists()).toBe(false)
  })

  it('center', () => {
    const wrapper = mount(Dialog, {
      props: {
        center: true
      }
    })

    expect(wrapper.find('.el-dialog').classes()).toContain('el-dialog--center')
  })

  test('Dialog render', async () => {
    const dialog = mount(Dialog, {
      slots: {
        footer: `<span>
                  <div>测试</div> 
                </span>`
      },
      global: {
        components: {
          Dialog
        }
      },
      data() {
        return {
          title: 'dialog test',
          visible: true
        }
      }
    })
    expect(dialog.find('.el-dialog__header').exists()).toBe(true)
    expect(dialog.find('.el-dialog__footer').exists()).toBe(true)
  })

  test('close', () => {
    const wrapper = mount(Dialog)
    wrapper.find('.el-dialog__headerbtn').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
