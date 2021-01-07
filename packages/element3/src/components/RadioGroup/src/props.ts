import { RadioGroupSize } from './types'
import { PropType } from 'vue'

export const props = {
  modelValue: [String, Number, Symbol, Boolean],
  size: {
    type: String as PropType<RadioGroupSize>,
    validator(val: string): boolean {
      return ['medium', 'small', 'mini', ''].includes(val)
    }
  },
  fill: {
    type: String,
    default: '#409EFF'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  disabled: Boolean
}
