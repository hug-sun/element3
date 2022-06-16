import { PropType } from 'vue'

export type ButtonType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text'

export type ButtonSize = 'large' | 'medium' | 'small' | 'mini'

export type ButtonNativeType = 'button' | 'submit' | 'reset' | 'menu'



export const props = {
  size: {
    type: String as PropType<ButtonSize>,
    validator(val: string): boolean {
      return ['medium', 'small', 'mini', ''].includes(val)
    }
  },
  type: {
    type: String as PropType<ButtonType>,
    validator(val: string): boolean {
      return [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'text'
      ].includes(val)
    }
  },
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: 'button'
  },
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  loading: Boolean,
  disabled: Boolean,
  icon: String
}
