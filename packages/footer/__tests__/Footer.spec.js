import Footer from '../Footer.vue'
import { mount } from '@vue/test-utils'
describe('Footer.vue', () => {
  it('height', () => {
    const wrapper = mount(Footer, {
      props: {
        height: '60px'
      }
    })
    expect(wrapper.find('.el-footer').attributes().style).toBe('height: 60px;')
  })
})
