export const props = {
  showWordLimit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: String
  },
  suffixIcon: {
    type: String
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'text'
  },
  size: {
    type: String,
    validator: function (value) {
      return ['medium', 'small', 'mini', ''].includes(value)
    }
  },
  autosize: {
    type: [Boolean, Object],
    default: false
  },
  resize: {
    type: String
  }
}
