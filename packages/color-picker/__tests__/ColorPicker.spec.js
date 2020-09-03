import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ColorPicker from '../src/ColorPicker.vue'

// todo

describe('ColorPicker', () => {
  test('should show alpha slider when show-alpha=true', async () => {
    const colorPicker = await mount({
      template: `
        <el-color-picker v-model="color" show-alpha></el-color-picker>
      `,
      components: {
        [ColorPicker.name]: ColorPicker
      },
      data() {
        return {
          color: null
        }
      }
    })
    const trigger = colorPicker.find('.el-color-picker__trigger')
    trigger.trigger('click')

    await nextTick()
    const alphaSlider = colorPicker.find('.el-color-alpha-slider')
    expect(alphaSlider.exists()).toBeTruthy()
  })
})
