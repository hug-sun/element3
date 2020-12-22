import { mount } from '@vue/test-utils'
import Rate from '../Rate'
import { ref, nextTick } from 'vue'

describe('Rate', () => {
  it('bind value by v-model', async () => {
    const modelValue = ref(4)
    const wrapper = mount(Rate, {
      props: {
        modelValue,
        'onUpdate:modelValue'(val) {
          modelValue.value = val
        }
      }
    })
    expect(modelValue.value).toBe(4)
    await wrapper.findAll('.el-rate__item')[2].trigger('click')
    await nextTick()
    expect(modelValue.value).toBe(3)
    await wrapper.find('.el-rate').trigger('keydown', { keyCode: '40' })
    await nextTick()
    expect(modelValue.value).toBe(2)
  })
  it('max', () => {
    const wrapper = mount(Rate, {
      props: {
        max: 10
      }
    })
    expect(wrapper.findAll('.el-rate__item').length).toBe(10)
  })
  it('disabled', () => {
    const wrapper = mount(Rate, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.find('[style="cursor: auto;"]').exists()).toBeTruthy()
  })
  it('allow-half', () => {
    const wrapper = mount(Rate, {
      props: {
        allowHalf: true
      }
    })
    expect(wrapper.find('[allow-half]')).toBeTruthy()
  })
  // it('low-threshold', () => {
  //   const wrapper = mount(Rate, {
  //     props: {
  //       modelValue: 1,
  //       lowThreshold: 2,
  //       colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  //     }
  //   })
  //   console.log(wrapper.find('.el-icon-star-on'))
  //   expect(wrapper.find('.el-icon-star-on').element.style.color).toBe(
  //     'rgb(153, 169, 191)'
  //   )
  // })
  // it('high-threshold', () => {
  //   const wrapper = mount(Rate, {
  //     porps: {
  //       modelValue: 4,
  //       highThreshold: 4,
  //       colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  //     }
  //   })
  //   expect(wrapper.find('.el-icon-star-on').element.style.color).toBe(
  //     'rgb(255, 153, 0)'
  //   )
  // })
  it('icon-classes is Array', async () => {
    const modelValue = ref(1)
    const wrapper = mount(Rate, {
      props: {
        iconClasses: [
          'icon-rate-face-1',
          'icon-rate-face-2',
          'icon-rate-face-3'
        ],
        modelValue,
        'onUpdate:modelValue'(val) {
          modelValue.value = val
        }
      }
    })

    expect(wrapper.find('.icon-rate-face-1').exists()).toBeTruthy()

    await wrapper.findAll('.el-rate__item')[3].trigger('click')
    await nextTick()
    expect(wrapper.find('.icon-rate.face-2'))

    await wrapper.findAll('.el-rate__item')[4].trigger('click')
    await nextTick()
    expect(wrapper.find('.icon-rate.face-3'))
  })
  it('void-icon-class', () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
        voidIconClass: 'el-icon-star-off'
      }
    })
    expect(wrapper.findAll('.el-rate__icon')[3].classes()).toContain(
      'el-icon-star-off'
    )
  })
  it('show-text', async () => {
    const wrapper = mount(Rate, {
      props: {
        showText: true,
        texts: ['极差', '失望', '一般', '满意', '惊喜'],
        modelValue: 3
      }
    })
    expect(wrapper.find('.el-rate__text').text()).toBe('一般')
  })
})
