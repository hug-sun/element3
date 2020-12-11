import { mount } from '@vue/test-utils'
import Radio from '../Radio'
import RadioGroup from 'element-ui/packages/radio-group/RadioGroup'
import { ref } from '@vue/reactivity'
import { h, nextTick } from '@vue/runtime-core'
import RadioButton from 'element-ui/packages/radio-button/RadioButton'

describe('Radio', () => {
  describe('props', () => {
    it('disabled', () => {
      const wrapper = mount(Radio, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })
    it('bordered', () => {
      const wrapper = mount(Radio, {
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('is-bordered')
    })
    it('bind value by v-model', async () => {
      const radio = ref(0)
      const wrapper = mount(Radio, {
        props: {
          modelValue: radio,
          label: 1,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          }
        }
      })
      await wrapper.trigger('click')

      expect(wrapper.classes()).toContain('is-checked')
    })
    it('change event', async () => {
      const radio = ref(0)
      const data = ref(0)
      const wrapper = mount(Radio, {
        props: {
          modelValue: radio,
          label: 1,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          },
          onChange(val) {
            data.value = val
          }
        }
      })
      await wrapper.trigger('click')
      await nextTick(() => {
        expect(data.value).toEqual(1)
      })
    })
  })
})

describe('Radio Group', () => {
  describe('props', () => {
    it('disabled', async () => {
      const radio = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radio,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          },
          disabled: true
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(Radio, {
              label: item
            })
          )
        }
      })
      expect(wrapper.findAllComponents('.is-disabled').length).toEqual(3)
    })
    it('bind value by v-model', async () => {
      const radio = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radio,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          }
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(Radio, {
              label: item
            })
          )
        }
      })
      expect(wrapper.find('.is-checked').exists()).toBe(true)
      expect(wrapper.findComponent('.is-checked').vm.label).toEqual(1)
      await wrapper.findAllComponents(Radio)[1].trigger('click')
      await nextTick(() => {
        expect(wrapper.findComponent('.is-checked').vm.label).toEqual(2)
      })
    })
    it('change event', async () => {
      const radio = ref(1)
      const data = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radio,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          },
          onChange(val) {
            data.value = val
          }
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(Radio, {
              label: item
            })
          )
        }
      })
      await wrapper.findAllComponents(Radio)[1].trigger('click')
      await nextTick(() => {
        expect(data.value).toEqual(2)
      })
    })
    it('keyboard event', async () => {
      const radio = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radio,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          }
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(Radio, {
              label: item
            })
          )
        }
      })
      await wrapper.findComponent(Radio).trigger('keydown', { keyCode: 39 })
      expect(radio.value).toEqual(2)
      await wrapper.findComponent(Radio).trigger('keydown', { keyCode: 40 })
      expect(radio.value).toEqual(2)
      await wrapper.findComponent(Radio).trigger('keydown', { keyCode: 38 })
      expect(radio.value).toEqual(3)
      await wrapper.findComponent(Radio).trigger('keydown', { keyCode: 37 })
      expect(radio.value).toEqual(3)
    })
  })
})

describe('Radio Button', () => {
  describe('props', () => {
    it('bind value by v-model', async () => {
      const radio = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radio,
          'onUpdate:modelValue': (val) => {
            radio.value = val
          }
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(RadioButton, {
              label: item
            })
          )
        }
      })
      expect(wrapper.find('.is-active').exists()).toBe(true)
      expect(wrapper.findComponent('.is-active').vm.label).toEqual(1)
      await wrapper.findAllComponents(RadioButton)[1].trigger('click')
      await nextTick(() => {
        expect(wrapper.findComponent('.is-active').vm.label).toEqual(2)
      })
    })
  })
})
