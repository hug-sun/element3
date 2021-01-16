import Switch from '../src/Switch.vue'
import { mount } from '@vue/test-utils'
describe('Switch', () => {
  it('snapshot', () => {
    const wrapper = mount(Switch)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('modelValue', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    expect(wrapper.classes()).not.toContain('is-checked')

    await wrapper.setProps({
      modelValue: true
    })

    expect(wrapper.classes()).toContain('is-checked')
  })

  it('should not click when set disabled to true', async () => {
    const wrapper = mount(Switch, {
      props: {
        disabled: true
      }
    })

    expect(wrapper.classes()).toContain('is-disabled')
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })

  it('set width props', () => {
    const wrapper = mount(Switch, {
      props: {
        width: 50
      }
    })

    expect(wrapper.get('.el-switch__core')).toHaveStyle({
      width: '50px'
    })
  })

  it('should show text on the right label when set activeText', () => {
    const wrapper = mount(Switch, {
      props: {
        activeText: 'on'
      }
    })

    const labelLeftElement = wrapper.find('.el-switch__label--right')
    expect(labelLeftElement.find('span').text()).toBe('on')
  })

  it('should show text on the left label when set inactiveText', () => {
    const wrapper = mount(Switch, {
      props: {
        inactiveText: 'off'
      }
    })

    const labelLeftElement = wrapper.find('.el-switch__label--left')
    expect(labelLeftElement.find('span').text()).toBe('off')
  })

  it('should show left label when set inactiveIconClass', () => {
    const wrapper = mount(Switch, {
      props: {
        inactiveIconClass: 'el-icon-close'
      }
    })

    const labelLeftElement = wrapper.find('.el-switch__label--left')
    expect(labelLeftElement.exists()).toBe(true)
    expect(labelLeftElement.find('i').classes()).toContain('el-icon-close')
  })

  it('should show right label when set activeIconClass', () => {
    const wrapper = mount(Switch, {
      props: {
        activeIconClass: 'el-icon-check'
      }
    })

    const labelLeftElement = wrapper.find('.el-switch__label--right')
    expect(labelLeftElement.exists()).toBe(true)
    expect(labelLeftElement.find('i').classes()).toContain('el-icon-check')
  })

  it('activeIconClass has a higher priority than activeText', () => {
    const wrapper = mount(Switch, {
      props: {
        activeIconClass: 'el-icon-check',
        activeText: 'on'
      }
    })

    const labelRightElement = wrapper.find('.el-switch__label--right')
    expect(labelRightElement.find('i').classes()).toContain('el-icon-check')
    expect(labelRightElement.find('span').exists()).toBe(false)
  })

  it('inactiveIconClass has a higher priority than inactiveText', () => {
    const wrapper = mount(Switch, {
      props: {
        inactiveIconClass: 'el-icon-check',
        inactiveText: 'off'
      }
    })

    const labelLeftElement = wrapper.find('.el-switch__label--left')
    expect(labelLeftElement.find('i').classes()).toContain('el-icon-check')
    expect(labelLeftElement.find('span').exists()).toBe(false)
  })

  it('should not show label when activeText and activeIconClass have not value', () => {
    const wrapper = mount(Switch)

    expect(wrapper.find('.el-switch__label--right').exists()).toBeFalsy()
  })

  it('should not show label when inactiveText and inactiveIconClass have not value', () => {
    const wrapper = mount(Switch)

    expect(wrapper.find('.el-switch__label--left').exists()).toBeFalsy()
  })

  it('core style contain border-color equal to #ff0000 when set activeColor', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true,
        activeColor: '#ff0000'
      }
    })

    expect(wrapper.get('.el-switch__core')).toHaveStyle({
      borderColor: '#ff0000'
    })
  })

  it('core style contain border-color equal to #ff0000 when set inactiveColor', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        inactiveColor: '#ff0000'
      }
    })

    expect(wrapper.get('.el-switch__core')).toHaveStyle({
      borderColor: '#ff0000'
    })
  })

  it('modelValue should be forced to be equal to inactiveValue when modelValue not equal activeValue and inactiveValue ', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: '1',
        activeValue: '2',
        inactiveValue: '3'
      }
    })

    expect(wrapper.emitted('update:modelValue')).toEqual([['3']])
  })

  it('should emit change event when change value', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    })

    wrapper.trigger('click')

    expect(wrapper.emitted('change')[0]).toEqual([true])
  })
})
