import { mount } from '@vue/test-utils'
import Rate from '../Rate'
import { ref, nextTick } from 'vue'

jest.spyOn(global.console, 'warn')

describe('Rate', () => {
  describe('props', () => {
    it('max', () => {
      const wrapper = mount(Rate, {
        props: {
          max: 10
        }
      })
      expect(wrapper.findAll('.el-rate__item').length).toEqual(10)
    })
    it('bind value by v-model', async () => {
      const value = ref(5)
      const wrapper = mount(Rate, {
        props: {
          modelValue: value,
          'onUpdate:modelValue'(val) {
            value.value = val
          }
        }
      })
      expect(value.value).toEqual(5)
      await wrapper.findAll('.el-rate__item')[2].trigger('click')
      await nextTick()
      expect(value.value).toEqual(3)
    })
    it('colors & icon-classes', async () => {
      const value = ref(1)
      const wrapper = mount(Rate, {
        props: {
          modelValue: value,
          'onUpdate:modelValue'(val) {
            value.value = val
          },
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          iconClasses: [
            'icon-rate-face-1',
            'icon-rate-face-2',
            'icon-rate-face-3'
          ]
        }
      })
      expect(wrapper.find('.icon-rate-face-1').exists()).toBeTruthy()
      expect(wrapper.find('.icon-rate-face-1').element.style.color).toBe(
        'rgb(153, 169, 191)'
      )

      await wrapper.findAll('.el-rate__item')[2].trigger('click')
      await nextTick()

      expect(wrapper.find('.icon-rate-face-2').exists()).toBeTruthy()
      expect(wrapper.find('.icon-rate-face-2').element.style.color).toBe(
        'rgb(247, 186, 42)'
      )

      await wrapper.findAll('.el-rate__item')[4].trigger('click')
      await nextTick()

      expect(wrapper.find('.icon-rate-face-3').exists()).toBeTruthy()
      expect(wrapper.find('.icon-rate-face-3').element.style.color).toBe(
        'rgb(255, 153, 0)'
      )
    })
    it('void-color & void-icon-class', () => {
      const wrapper = mount(Rate, {
        props: {
          voidColor: 'red',
          voidIconClass: 'el-icon-star-on',
          modelValue: null
        }
      })
      expect(wrapper.find('.el-icon-star-on').exists()).toBeTruthy()
      expect(wrapper.find('.el-icon-star-on').element.style.color).toBe('red')
    })
    it('disabled & disabled-void-color & disabled-void-icon-class', async () => {
      const value = ref(0)
      const wrapper = mount(Rate, {
        props: {
          disabled: true,
          disabledVoidColor: 'red',
          disabledVoidIconClass: 'el-icon-star-off',
          modelValue: value,
          'onUpdate:modelValue'(val) {
            value.value = val
          }
        }
      })
      expect(wrapper.find('.el-icon-star-off').exists()).toBeTruthy()
      expect(wrapper.find('.el-icon-star-off').element.style.color).toBe('red')

      await wrapper.findAll('.el-rate__item')[2].trigger('click')
      await nextTick()

      expect(value.value).toEqual(0)
    })
    it('low-threshold', () => {
      const wrapper = mount(Rate, {
        props: {
          modelValue: 3,
          lowThreshold: 3,
          colors: ['#99A9BF', '#F7BA2A', '#FF9900']
        }
      })
      expect(wrapper.find('.el-icon-star-on').element.style.color).toBe(
        'rgb(153, 169, 191)'
      )
    })
    it('low-threshold', () => {
      const wrapper = mount(Rate, {
        props: {
          modelValue: 3,
          lowThreshold: 1,
          highThreshold: 3,
          colors: ['#99A9BF', '#F7BA2A', '#FF9900']
        }
      })
      expect(wrapper.find('.el-icon-star-on').element.style.color).toBe(
        'rgb(255, 153, 0)'
      )
    })
    it('score-template & show-score', () => {
      const value = ref(3.7)
      const wrapper = mount(Rate, {
        props: {
          modelValue: value,
          disabled: true,
          'text-template': '{value}',
          scoreTemplate: '{value}',
          showScore: true
        }
      })
      expect(console.warn).toBeCalledWith(
        '[Element Migrating][ElRate][Attribute]: text-template is renamed to score-template.'
      )
      expect(wrapper.find('.el-rate__decimal').exists()).toBeTruthy()
      expect(wrapper.find('.el-rate__text').exists()).toBeTruthy()
      expect(wrapper.find('.el-rate__text').text()).toBe('3.7')
    })
    it('texts & show-text', () => {
      const wrapper = mount(Rate, {
        props: {
          modelValue: 5,
          showText: true,
          texts: ['差劲', '差劲', '差劲', '差劲', '差劲']
        }
      })
      expect(wrapper.find('.el-rate__text').exists()).toBeTruthy()
      expect(wrapper.find('.el-rate__text').text()).toBe('差劲')
    })
  })
})
