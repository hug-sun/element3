export const props = {
  size: {
    type: String,
    validator(val) {
      return ['medium', 'small', 'mini', ''].includes(val)
    }
  },
  type: {
    type: String,
    validator(val) {
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
    type: String,
    default: 'button'
  },
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  loading: Boolean,
  disabled: Boolean,
  icon: String
}
