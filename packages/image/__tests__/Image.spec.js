import Image from '../Image.vue'
import { mount } from '@vue/test-utils'

describe('Image.vue', () => {
  describe('src', () => {
    const wrapper = mount(Image, {
      props: {
        src: 'test.jpg'
      }
    })
    wrapper.componentVM.$isServer = false
    wrapper.componentVM.loading = false
    it('load', () => {
      expect(wrapper.find('.el-image__inner').attributes('src')).toBe(
        'test.jpg'
      )
    })
  })
})
