import Checkbox from '../Checkbox.vue'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

describe('Checkbox.vue', () => {
  describe('props', () => {
    it('vModel modelValue is boolean', async () => {
      const modelValue = ref(true)
      const wrapper = mount(Checkbox, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        }
      })

      expect(wrapper.props('modelValue')).toBe(true)
      await nextTick()
      await wrapper.trigger('click')
      expect(modelValue.value).toBe(false)
    })

    it('true-label and false-label', async () => {
      const modelValue = ref('真')
      const wrapper = mount(Checkbox, {
        props: {
          modelValue,
          trueLabel: '真',
          falseLabel: '假',
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        }
      })

      expect(wrapper.props('modelValue')).toBe('真')
      await nextTick()
      await wrapper.trigger('click')
      expect(modelValue.value).toBe('假')
    })

    it('disabled', async () => {
      const modelValue = ref(true)
      const wrapper = mount(Checkbox, {
        props: {
          modelValue,
          disabled: true,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        }
      })
      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.props('modelValue')).toBe(true)
      await nextTick()
      await wrapper.trigger('click')
      expect(modelValue.value).toBe(true)
    })

    it('border', async () => {
      const wrapper = mount(Checkbox, {
        props: {
          border: true
        }
      })
      expect(wrapper.classes()).toContain('is-bordered')
    })

    it('indeterminate', async () => {
      const wrapper = mount(Checkbox, {
        props: {
          indeterminate: true
        }
      })
      expect(wrapper.findAll('.is-indeterminate')).toHaveLength(1)
    })

    it('size', async () => {
      const wrapper = mount(Checkbox, {
        props: {
          border: true
        }
      })
      await wrapper.setProps({ size: 'mini' })
      expect(wrapper.classes()).toContain('el-checkbox--mini')
      await wrapper.setProps({ size: 'small' })
      expect(wrapper.classes()).toContain('el-checkbox--small')
      await wrapper.setProps({ size: 'medium' })
      expect(wrapper.classes()).toContain('el-checkbox--medium')
    })

    it('name', async () => {
      const wrapper = mount(Checkbox, {
        props: {
          name: 'checkbox1'
        }
      })
      expect(wrapper.find('input[type=checkbox]').attributes('name')).toBe(
        'checkbox1'
      )
    })

    it('vModel modelValue is array', async () => {
      const modelValue = ref([])
      const wrappers = []
      wrappers.push(
        mount(Checkbox, {
          props: {
            label: '选项A',
            modelValue,
            'onUpdate:modelValue'(v) {
              modelValue.value = v
            }
          }
        })
      )

      wrappers.push(
        mount(Checkbox, {
          props: {
            label: '选项B',
            modelValue,
            'onUpdate:modelValue'(v) {
              modelValue.value = v
            }
          }
        })
      )

      await nextTick()
      await wrappers[0].trigger('click')
      expect(modelValue.value).toContain('选项A')
      await nextTick()
      await wrappers[1].trigger('click')
      expect(modelValue.value).toStrictEqual(['选项A', '选项B'])
      await nextTick()
      await wrappers[1].trigger('click')
      expect(modelValue.value).toContain('选项A')
    })

    it('checked', async () => {
      const modelValue = ref(true)
      const wrapper = mount(Checkbox, {
        props: {
          modelValue,
          checked: false,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          }
        }
      })

      await nextTick()
      expect(wrapper.props('modelValue')).toBe(false)
    })
  })

  describe('event', () => {
    it('change', async () => {
      const modelValue = ref(true)
      const changeValue = ref(true)
      const wrapper = mount(Checkbox, {
        props: {
          modelValue,
          'onUpdate:modelValue'(v) {
            modelValue.value = v
          },
          onChange(v) {
            changeValue.value = v
          }
        }
      })

      await nextTick()
      await wrapper.trigger('click')
      await nextTick()
      expect(modelValue.value).toBe(false)
      expect(changeValue.value).toBe(false)
    })
  })
})
