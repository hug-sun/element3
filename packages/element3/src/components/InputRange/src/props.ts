import { PropType } from '@vue/runtime-core'
import { inputRangeSize } from './types'

export const props = {
  modelValue: {
    type: Array
  },
  readonly: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  editable: {
    type: Boolean,
    default: true
  },
  size: {
    type: String as PropType<inputRangeSize>,
    validator(val: string): boolean {
      return ['medium', 'small', 'mini', ''].includes(val)
    }
  }
}
