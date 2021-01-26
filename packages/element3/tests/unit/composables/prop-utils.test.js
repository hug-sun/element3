import { usePropUtils } from '../../../src/composables/prop-utils'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'

describe('prop-utils', () => {
  describe('isAfferentProp', () => {
    it('Determine whether it is the incoming Prop', async () => {
      const Comp = {
        props: {
          label: String,
          isShow: Boolean
        },
        render(ctx) {
          return h('div', ctx.label)
        },
        setup() {
          const { isAfferentProp } = usePropUtils()
          const isAfferentLabel = ref(isAfferentProp('label'))
          const isAfferentIsShow = ref(isAfferentProp('isShow'))
          return {
            isAfferentLabel,
            isAfferentIsShow
          }
        }
      }
      const wrapper = mount(Comp, { props: { label: 'hello' } })
      expect(wrapper.vm.isAfferentLabel).toBe(true)
      expect(wrapper.vm.isAfferentIsShow).toBe(false)
    })
  })
})
