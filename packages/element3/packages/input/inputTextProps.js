export const props = {
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    modelValue: [String, Number],
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
    }
  }