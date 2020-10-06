/*
 * @Author: Mr Chang
 * @Date: 2020-09-17 16:36:34
 * @LastEditTime: 2020-09-18 17:14:36
 * @LastEditors: Mr Chang
 * @Description: 单元测试
 * @FilePath: \element3\packages\color-picker\__tests__\color-picker.spec.js
 */
import ColorPicker from '../index'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

describe('ColorPicker', () => {
  afterEach(() => {
    const dropdown = document.querySelector('.el-color-dropdown')
    if (dropdown && dropdown.parentNode) {
      dropdown.parentNode.removeChild(dropdown)
    }
  })
  it('should work', () => {
    const wrapper = mount(ColorPicker)
    expect(wrapper.exists()).toBe(true)
  })

  it('should show alpha slider when show-alpha=true', async () => {
    const wrapper = mount({
      template: `
        <el-color-picker v-model="color" show-alpha></el-color-picker>
      `,
      components: {
        [ColorPicker.name]: ColorPicker
      },
      setup() {
        const color = ref(null)
        return {
          color
        }
      }
    })
    await wrapper.find('.el-color-picker__trigger').trigger('click')

    const alphaSlider = document.querySelector('.el-color-alpha-slider')
    expect(alphaSlider instanceof HTMLElement).toBe(true)
  })

  it('should show color picker when click trigger', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.el-color-picker__trigger').trigger('click')
    const dropdown = document.querySelector('.el-color-dropdown')

    expect(dropdown instanceof HTMLElement).toBe(true)
  })

  it('should pick a color when confirm button click', async () => {
    const wrapper = mount({
      template: `
        <el-color-picker v-model="color"></el-color-picker>
      `,
      components: {
        [ColorPicker.name]: ColorPicker
      },
      data() {
        const color = ref(null)
        return {
          color
        }
      }
    })
    await wrapper.find('.el-color-picker__trigger').trigger('click')

    const dropdown = document.querySelector('.el-color-dropdown__btn')
    dropdown.click()
    await nextTick()

    expect(wrapper.vm.color).toEqual('#FF0000')
  })

  it('should show correct rgb value', async () => {
    const wrapper = mount({
      template: `
        <el-color-picker v-model="color"></el-color-picker>
      `,
      components: {
        [ColorPicker.name]: ColorPicker
      },
      data() {
        const color = ref('#20A0FF')
        return {
          color
        }
      }
    })
    await wrapper.find('.el-color-picker__trigger').trigger('click')

    const input = document.querySelector('.el-color-dropdown__value input')
    expect(input.value.trim().toUpperCase()).toEqual('#20A0FF')
  })
  test.todo('should init the right color when open')

  it('should clear a color when clear button click', async () => {
    const wrapper = mount({
      template: `
        <el-color-picker v-model="color"></el-color-picker>
      `,
      components: {
        [ColorPicker.name]: ColorPicker
      },
      setup() {
        const color = ref('#f00')
        return {
          color
        }
      }
    })
    await wrapper.find('.el-color-picker__trigger').trigger('click')
    const clearBtn = document.querySelector('.el-color-dropdown__link-btn')
    clearBtn.click()
    await nextTick()

    expect(wrapper.vm.color).toBe(null)
  })

  test.todo('should change hue when saturation is zero')
})
