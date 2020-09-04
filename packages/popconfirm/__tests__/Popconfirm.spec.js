import Popconfirm from '../Popconfirm.vue'
import { mount } from '@vue/test-utils'

describe('Popconfirm', () => {
  it('Attributes', () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: 'title',
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        confirmButtonType: 'danger',
        cancelButtonType: 'info',
        icon: 'el-icon-delete',
        iconColor: 'pink',
        hideIcon: false
      }
    })
    expect(wrapper.find('.el-popconfirm__main').text()).toContain('title')

    expect(
      wrapper.find('.el-popconfirm__action>button:last-child>span').text()
    ).toContain('confirm')

    expect(
      wrapper.find('.el-popconfirm__action>button:first-child>span').text()
    ).toContain('cancel')

    const confirmBtn = wrapper.find('.el-popconfirm__action>button:last-child')
    expect(confirmBtn.attributes().class).toContain('el-button--danger')

    const cancelBtn = wrapper.find('.el-popconfirm__action>button:first-child')
    expect(cancelBtn.attributes().class).toContain('el-button--info')

    expect(wrapper.find('.el-popconfirm__main>i').attributes().class).toContain(
      'el-icon-delete'
    )
    expect(wrapper.find('.el-popconfirm__main>i').element.style.color).toBe(
      'pink'
    )
  })

  test('Attributes:hideIcon', () => {
    const wrapper = mount(Popconfirm, {
      props: { hideIcon: true }
    })
    expect(wrapper.findAll('.el-popconfirm__main>i')).toHaveLength(0)
  })

  it('Slot', () => {
    const wrapper = mount(Popconfirm, {
      slots: {
        reference:
          '<el-button class="reference-slot">reference slot</el-button>'
      }
    })
    expect(wrapper.find('.reference-slot').text()).toBe('reference slot')
  })

  it('Events:confirm event', async () => {
    const wrapper = mount(Popconfirm)
    const confirmBtn = wrapper.find('.el-popconfirm__action>button:last-child')
    await confirmBtn.trigger('click')
    expect(wrapper.emitted('onConfirm')).toBeTruthy()
  })

  it('Events:cancel event', async () => {
    const wrapper = mount(Popconfirm)
    const cancelBtn = wrapper.find('.el-popconfirm__action>button:first-child')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('onCancel')).toBeTruthy()
  })
})
