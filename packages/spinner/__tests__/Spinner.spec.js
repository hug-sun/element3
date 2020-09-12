import Spinner from '../Spinner.vue'
import { mount } from '@vue/test-utils'

describe('Spinner', () => {
  it('radius', () => {
    const wrapper = mount(Spinner, {
      props: {
        radius: 50
      }
    })
    expect(wrapper.find('.el-spinner-inner').attributes().style).toBe(
      'width: 25px; height: 25px;'
    )
  })

  it('strokeWidth', () => {
    const wrapper = mount(Spinner, {
      props: {
        strokeWidth: 2
      }
    })
    expect(wrapper.find('.path').attributes()['stroke-width']).toBe('2')
  })

  it('strokeColor', () => {
    const wrapper = mount(Spinner, {
      props: {
        strokeColor: 'red'
      }
    })
    expect(wrapper.find('.path').attributes().stroke).toBe('red')
  })
})
