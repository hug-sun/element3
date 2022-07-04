import { mount } from '@vue/test-utils'
import Alert from '../Alert.vue'

describe('测试Alert组件', () => {
  it('title属性定义组件内容', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
      },
    })
    expect(wrapper.find('.el-alert__title').text()).toBe('Element3')
  })

  it('type属性定义主题', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        type: 'success',
      },
    })
    const text = wrapper.find('.el-alert')
    expect(text.classes()).toContain('el-alert--success')
  })

  it('effect定义深浅主题', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        effect: 'dark',
      },
    })
    const text = wrapper.find('.el-alert')
    expect(text.classes()).toContain('is-dark')
  })

  it('是否显示关闭按钮图标', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        closable: false,
      },
    })
    expect(wrapper.props('closable')).toBe(false)
  })

  it('自定义关闭文本', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        closeText: '知道了',
      },
    })
    const text = wrapper.find('.el-alert__closebtn')
    expect(text.classes()).toContain('is-customed')
  })

  it('关闭Alert回调', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
      },
    })
    wrapper.find('.el-alert__closebtn').trigger('click')
    expect(wrapper.vm.showAlert).toBe(false)
  })

  it('提示icon', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        type: 'success',
        showIcon: true,
      },
    })
    const text = wrapper.find('.el-alert__icon')
    expect(text.classes()).toContain('el-icon-success')
  })

  it('文字居中', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: 'Element3',
        type: 'success',
        showIcon: true,
        center: true,
      },
    })
    const text = wrapper.find('.el-alert')
    expect(text.classes()).toContain('is-center')
  })

  it('带有辅助性文字介绍', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: '带辅助性文字介绍',
        description:
          '这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……',
      },
    })
    expect(wrapper.find('.el-alert__description').exists()).toBe(true)
  })

  it('带有icon和辅助性文字介绍', () => {
    const wrapper = mount(Alert, {
      propsData: {
        title: '带辅助性文字介绍',
        description:
          '这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……',
        showIcon: true,
      },
    })
    expect(wrapper.find('.is-big').exists()).toBe(true)
  })
})
