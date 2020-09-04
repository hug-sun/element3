import InputNumber from '../InputNumber'
import { mount } from '@vue/test-utils'

const globalOption = {
  config: {
    globalProperties: {
      $ELEMENT: {
        size: '',
        zIndex: 2000
      }
    }
  }
}

describe('InputNumber.vue', () => {
  it('create ', async () => {
    const wrapper = mount(
      {
        template: `
                  <el-input-number 
                      v-model="num" 
                      controls-position="right" 
                      @change="handleChange" 
                      :min="1" 
                      :max="10">
                  </el-input-number>
                `,
        data() {
          return {
            num: 1
          }
        },
        methods: {
          handleChange(value) {
            console.log(value)
          }
        },
        components: {
          [InputNumber.name]: InputNumber
        }
      },
      {
        global: globalOption
      }
    )
    const inputElm = wrapper.find('input')
    expect(inputElm.element.value).toEqual('1')
  })
})
