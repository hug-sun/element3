import Checkbox from '../../checkbox/Checkbox'
import CheckboxButton from '../../checkbox-button/CheckboxButton'
import CheckboxGroup from '../CheckboxGroup'
import { mount } from '@vue/test-utils'
import { ref, h, nextTick } from 'vue'

describe('CheckboxGroup.vue and Checkbox.vue', () => {
  describe('props', () => {
    it('border', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          border: true
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).toContain('is-bordered')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).toContain('is-bordered')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).toContain('is-bordered')
    })

    it('disabled', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          disabled: true
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).toContain('is-disabled')
    })

    it('size', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          border: true
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper.setProps({ size: 'mini' })
      expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
        'el-checkbox--mini'
      )
      await wrapper.setProps({ size: 'small' })
      expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
        'el-checkbox--small'
      )
      await wrapper.setProps({ size: 'medium' })
      expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
        'el-checkbox--medium'
      )
    })

    it('modelValue/vModel', async () => {
      const modelValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[0]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A'])

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[1]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A', 'B'])

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[2]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A', 'B', 'C'])

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[0]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['B', 'C'])
    })

    it('sub checkbox checked', async () => {
      const modelValue = ref([])
      mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) =>
            h(Checkbox, { label, checked: label === 'A' })
          )
        }
      })

      expect(modelValue.value).toStrictEqual(['A'])
    })

    it('min and max', async () => {
      const modelValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          min: 1,
          max: 2,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[0]
        .trigger('click')
      expect(modelValue.value).toHaveLength(1)

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[1]
        .trigger('click')
      expect(modelValue.value).toHaveLength(2)

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[2]
        .trigger('click')
      expect(modelValue.value).toHaveLength(2)

      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[1]
        .trigger('click')
      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[0]
        .trigger('click')
      expect(modelValue.value).toHaveLength(1)
    })
  })

  describe('event', () => {
    it('change', async () => {
      const modelValue = ref([])
      const changeValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          },
          onChange(v) {
            changeValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(Checkbox, { label }))
        }
      })
      await wrapper
        .findAllComponents({ name: 'ElCheckbox' })[2]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['C'])
      await nextTick()
      expect(changeValue.value).toStrictEqual(['C'])
    })
  })
})

describe('CheckboxGroup.vue and CheckboxButton.vue', () => {
  describe('props', () => {
    it('disabled', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          disabled: true
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(CheckboxButton, { label }))
        }
      })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckboxButton' })[0].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckboxButton' })[1].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckboxButton' })[2].classes()
      ).toContain('is-disabled')
    })

    it('size', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          border: true
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(CheckboxButton, { label }))
        }
      })

      await wrapper.setProps({ size: 'mini' })
      expect(
        wrapper.findComponent({ name: 'ElCheckboxButton' }).classes()
      ).toContain('el-checkbox-button--mini')
      await wrapper.setProps({ size: 'small' })
      expect(
        wrapper.findComponent({ name: 'ElCheckboxButton' }).classes()
      ).toContain('el-checkbox-button--small')
      await wrapper.setProps({ size: 'medium' })
      expect(
        wrapper.findComponent({ name: 'ElCheckboxButton' }).classes()
      ).toContain('el-checkbox-button--medium')
    })

    it('modelValue/vModel', async () => {
      const modelValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(CheckboxButton, { label }))
        }
      })

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[0]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A'])

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[1]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A', 'B'])

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[2]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['A', 'B', 'C'])

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[0]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['B', 'C'])
    })

    it('sub checkbox checked', async () => {
      const modelValue = ref([])
      mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) =>
            h(CheckboxButton, { label, checked: label === 'A' })
          )
        }
      })

      expect(modelValue.value).toStrictEqual(['A'])
    })

    it('min and max', async () => {
      const modelValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          min: 1,
          max: 2,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(CheckboxButton, { label }))
        }
      })

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[0]
        .trigger('click')
      expect(modelValue.value).toHaveLength(1)

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[1]
        .trigger('click')
      expect(modelValue.value).toHaveLength(2)

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[2]
        .trigger('click')
      expect(modelValue.value).toHaveLength(2)

      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[1]
        .trigger('click')
      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[0]
        .trigger('click')
      expect(modelValue.value).toHaveLength(1)
    })
  })

  describe('event', () => {
    it('change', async () => {
      const modelValue = ref([])
      const changeValue = ref([])
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          },
          onChange(v) {
            changeValue.value = v
          }
        },
        slots: {
          default: ['A', 'B', 'C'].map((label) => h(CheckboxButton, { label }))
        }
      })
      await wrapper
        .findAllComponents({ name: 'ElCheckboxButton' })[2]
        .trigger('click')
      expect(modelValue.value).toStrictEqual(['C'])
      await nextTick()
      expect(changeValue.value).toStrictEqual(['C'])
    })
  })
})
