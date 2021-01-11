import { mount } from '@vue/test-utils'
import { ref, h, reactive } from 'vue'
import RadioGroup from '../../RadioGroup/src/RadioGroup.vue'
import Radio from '../src/Radio.vue'

describe('Radio.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Radio)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('props', () => {
    it('disabled', () => {
      const wrapper = mount(Radio, {
        props: {
          disabled: true
        }
      })
      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.vm.isDisabled).toEqual(true)
    })
    it('border and size', () => {
      const wrapper = mount(Radio, {
        props: {
          border: true,
          size: 'small'
        }
      })
      expect(wrapper.vm.radioSize).toEqual('small')
      expect(wrapper.classes()).toContain('is-bordered')
      expect(wrapper.classes()).toContain('el-radio--small')
    })
    it('v-model', async () => {
      const radioVal = ref(0)
      const wrapper = mount(Radio, {
        props: {
          label: 1,
          modelValue: radioVal,
          'onUpdate:modelValue': (val) => {
            radioVal.value = val
          }
        }
      })
      expect(wrapper.vm.radioValue).toBe(0)
      await wrapper.trigger('click')
      expect(wrapper.vm.radioValue).toBe(1)
    })
    it('by elForm.disable', () => {
      const wrapper = mount(Radio, {
        global: {
          provide: {
            elForm: reactive({
              disabled: true
            })
          }
        }
      })
      expect(wrapper.classes()).toContain(`is-disabled`)
    })
    it('set props event change', async () => {
      const radioVal = ref(0)
      const wrapper = mount(Radio, {
        props: {
          label: 1,
          modelValue: radioVal,
          'onUpdate:modelValue': (val) => {
            radioVal.value = val
          },
          disabled: true
        }
      })
      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.vm.radioValue).toBe(0)
      await wrapper.trigger('click')
      expect(wrapper.vm.radioValue).not.toBe(1)
    })
  })
})

describe('Radio Group', () => {
  describe('props', () => {
    it('disabled and size', () => {
      const radioVal = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radioVal,
          'onUpdate:modelValue': (val) => {
            radioVal.value = val
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
    it('set single disabled to change event', async () => {
      const radioVal = ref(1)
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: radioVal,
          'onUpdate:modelValue': (val) => {
            radioVal.value = val
          }
        },
        slots: {
          default: [1, 2, 3].map((item) =>
            h(Radio, {
              label: item,
              disabled: item === 2
            })
          )
        }
      })
      expect(wrapper.vm.modelValue).toBe(1)
      expect(wrapper.findAllComponents(Radio).length).toBe(3)
      const radioTem = wrapper.findAllComponents(Radio)
      expect(radioTem[1].classes()).toContain('is-disabled')
      await radioTem[1].trigger('click')
      expect(wrapper.vm.modelValue).not.toBe(2)
      await radioTem[2].trigger('click')
      expect(wrapper.vm.modelValue).toBe(3)
    })
  })
})
