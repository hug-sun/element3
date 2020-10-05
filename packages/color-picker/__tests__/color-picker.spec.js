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
import { ref } from 'vue'

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

  // it('should pick a color when confirm button click', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     data() {
  //       const color = ref(null)
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')

  //   const dropdown = document.querySelector('.el-color-dropdown__btn')
  //   dropdown.click()
  //   await nextTick()

  //   expect(wrapper.vm.color).toEqual('#FF0000')
  // })

  // it('should show correct rgb value', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     data() {
  //       const color = ref('#20A0FF')
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')

  //   const input = document.querySelector('.el-color-dropdown__value input')
  //   expect(input.value.trim().toUpperCase()).toEqual('#20A0FF')
  // })
  test.todo('should init the right color when open')

  // it('should clear a color when clear button click', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     setup() {
  //       const color = ref('#f00')
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   const clearBtn = document.querySelector('.el-color-dropdown__link-btn')
  //   clearBtn.click()
  //   await nextTick()

  //   expect(wrapper.vm.color).toBe(null)
  // })

  // it('should change hue when clicking the hue bar', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     setup() {
  //       const color = ref('#f00')
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   const hueBar = wrapper.findComponent({ name: 'el-color-hue-slider' })
  //   hueBar.element.getBoundingClientRect = jest.fn(() => ({
  //     bottom: 626,
  //     height: 180,
  //     left: 923,
  //     right: 935,
  //     top: 446,
  //     width: 12,
  //     x: 923,
  //     y: 446
  //   }))
  //   hueBar.vm.handleClick({ target: null, clientX: 0, clientY: 1000 })
  //   await nextTick()
  //   const picker = wrapper.findComponent({ name: 'el-color-picker' })
  //   expect(picker.vm.color._hue > 0).toBe(true)
  // })

  test.todo('should change hue when saturation is zero')

  // it('should change alpha when clicking the alpha bar', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color" show-alpha></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     setup() {
  //       const color = ref('#f00')
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   const alphaBar = wrapper.findComponent({ name: 'el-color-alpha-slider' })
  //   alphaBar.element.getBoundingClientRect = jest.fn(() => ({
  //     bottom: 458,
  //     height: 12,
  //     left: 165,
  //     right: 445,
  //     top: 446,
  //     width: 280,
  //     x: 165,
  //     y: 446
  //   }))
  //   alphaBar.vm.handleClick({ target: null, clientX: 50, clientY: 0 })
  //   const picker = wrapper.findComponent({ name: 'el-color-picker' })
  //   expect(picker.vm.color._alpha < 100).toBe(true)
  // })

  // it('should change saturation and value when clicking the sv-panel', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color" color-format="hsv"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     data() {
  //       const color = ref('hsv(0, 50%, 50%)')
  //       return {
  //         color
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   const svPanel = wrapper.findComponent({ name: 'el-sl-panel' })
  //   svPanel.element.getBoundingClientRect = jest.fn(() => ({
  //     bottom: 440,
  //     height: 180,
  //     left: 165,
  //     right: 445,
  //     top: 260,
  //     width: 280,
  //     x: 165,
  //     y: 260
  //   }))
  //   svPanel.vm.handleDrag({ clientX: 0, clientY: 0 })
  //   const picker = wrapper.findComponent({ name: 'el-color-picker' })
  //   expect(picker.vm.color._saturation !== 50).toBe(true)
  //   expect(picker.vm.color._value !== 50).toBe(true)
  // })

  // it('should change color to the selected color', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color" show-alpha :predefine="colors"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     setup() {
  //       const color = ref('hsva(180, 65, 20, 0.5)')
  //       const colors = ref([
  //         'rgba(19, 206, 102, 0.18)',
  //         'rgb(25, 159, 147)',
  //         'hsv(250, 54, 98)',
  //         'hsva(180, 65, 20, 0.5)',
  //         'hsl(170, 32%, 87%)',
  //         'hsla(45, 62%, 47%, 0.13)',
  //         '#7486de',
  //         '#45aa9477',
  //         '#892345'
  //       ])
  //       return {
  //         color,
  //         colors
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   expect(
  //     document.querySelectorAll('.el-color-predefine__color-selector')
  //       .length === 9
  //   ).toBe(true)
  //   const selector = document.querySelector(
  //     '.el-color-predefine__color-selector:nth-child(4)'
  //   )
  //   selector.click()
  //   await nextTick()
  //   const picker = wrapper.findComponent({ name: 'el-color-picker' })
  //   expect(picker.vm.color._hue === 180).toBe(true)
  //   expect(picker.vm.color._saturation === 65).toBe(true)
  //   expect(picker.vm.color._value === 20).toBe(true)
  //   expect(picker.vm.color._alpha === 50).toBe(true)

  //   const selector2 = document.querySelector(
  //     '.el-color-predefine__color-selector:nth-child(3)'
  //   )
  //   selector2.click()
  //   await nextTick()
  //   expect(picker.vm.color._hue === 250).toBe(true)
  //   expect(picker.vm.color._saturation === 54).toBe(true)
  //   expect(picker.vm.color._value === 98).toBe(true)
  //   expect(picker.vm.color._alpha === 100).toBe(true)
  // })

  // it('should change selected state of predefined color', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-color-picker v-model="color" show-alpha :predefine="colors"></el-color-picker>
  //     `,
  //     components: {
  //       [ColorPicker.name]: ColorPicker
  //     },
  //     data() {
  //       const color = ref('hsva(180, 65, 20, 0.5)')
  //       const colors = ref([
  //         'rgba(19, 206, 102, 0.18)',
  //         'rgb(25, 159, 147)',
  //         'hsv(250, 54, 98)',
  //         'hsva(180, 65, 20, 0.5)',
  //         'hsl(170, 32%, 87%)',
  //         'hsla(45, 62%, 47%, 0.13)',
  //         '#7486de',
  //         '#45aa9477',
  //         '#892345'
  //       ])
  //       return {
  //         color,
  //         colors
  //       }
  //     }
  //   })
  //   await wrapper.find('.el-color-picker__trigger').trigger('click')
  //   const selector = document.querySelector(
  //     '.el-color-predefine__color-selector:nth-child(4)'
  //   )
  //   selector.click()
  //   await nextTick()
  //   expect(selector.classList.contains('selected')).toBe(true)
  //   const hueBar = wrapper.findComponent({ name: 'el-color-hue-slider' })
  //   hueBar.element.getBoundingClientRect = jest.fn(() => ({
  //     bottom: 626,
  //     height: 180,
  //     left: 923,
  //     right: 935,
  //     top: 446,
  //     width: 12,
  //     x: 923,
  //     y: 446
  //   }))
  //   hueBar.vm.handleClick({ target: null, clientX: 0, clientY: 1000 })
  //   await nextTick()
  //   expect(selector.classList.contains('selected')).toBe(false)
  // })
})
