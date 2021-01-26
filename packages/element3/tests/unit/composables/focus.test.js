import useFocus from '../../../src/composables/focus'
import { mount } from '@vue/test-utils'
import { onMounted, ref } from 'vue'

describe('focus', () => {
  it('ref is string', () => {
    const wrapper = mount(
      {
        template: `<input ref="input" />`,
        setup() {
          const focus = useFocus('input')
          onMounted(() => {
            focus()
          })
        }
      },
      {
        attachTo: document.body
      }
    )

    expect(wrapper.find('input').element).toBe(document.activeElement)
  })

  it('ref is refObject', () => {
    const wrapper = mount(
      {
        template: `<input ref="input" />`,
        setup() {
          const input = ref(null)
          const focus = useFocus(input)
          onMounted(() => {
            focus()
          })

          return {
            input
          }
        }
      },
      {
        attachTo: document.body
      }
    )

    expect(wrapper.find('input').element).toBe(document.activeElement)
  })
})
